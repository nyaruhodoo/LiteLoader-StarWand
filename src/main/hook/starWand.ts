import { EventEmitter } from 'node:events'

import type {
  ListenerPaths,
  Wrapper,
  WrapperEventMap,
  WrapperInterceptors,
  WrapperPaths,
  WrapperResolvePath,
} from '@/types/wrapper/core'
import type { NodeIQQNTWrapperSession } from '@/types/wrapper/core/NodeIQQNTWrapperSession'
import { WrapperEventEnum } from '@/types/wrapper/eventEnum'

import type { FnTracePayload, NodeDebugger } from './socket'

export interface ConfigType {
  /**
   * 需要中断的黑名单事件
   */
  eventBlacklist?: (WrapperPaths | RegExp)[]
  /**
   * 事件拦截器，可以拦截请求参数以及返回值
   */
  eventInterceptors?: WrapperInterceptors
}

/**
 * 根据字符串特征返回指定关键词
 * @param {string} str - 待检测的字符串
 * @returns {string|undefined} 匹配到则返回Listener/Service，无匹配返回undefined
 */
function getTargetKeyword(str: string) {
  // 去除字符串首尾空格（避免空格影响匹配）
  const trimmedStr = str.trim()

  // 1. 优先检测是否包含 "Listener"（不区分大小写可修改为：trimmedStr.toLowerCase().includes('listener')）
  if (trimmedStr.includes('Listener')) {
    return 'Listener'
  }

  // 2. 检测是否以 "Service" 结尾（不区分大小写可修改为：trimmedStr.toLowerCase().endsWith('service')）
  if (trimmedStr.endsWith('Service')) {
    return 'Service'
  }

  return 'Function'
}

/**
 * Service 返回的是实例，直接塞给调试面板序列化没意义（大概率循环引用 / 巨量字段），
 * 改成记录它身上有哪些方法；非对象原样返回，避免对 null 取原型抛错
 */
function listInstanceMethods(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value

  const proto = Object.getPrototypeOf(value) as object | null
  return proto ? Object.getOwnPropertyNames(proto) : []
}

export class StarWand {
  wrapperEmitter = new EventEmitter<WrapperEventMap>()
  // 非必须的情况下不给很详细的类型，因为真的很卡 /(ㄒoㄒ)/~~
  #listenerMap = new Map<string, Set<Record<string, (...args: unknown[]) => void>>>()
  /**
   * Service 实例的缓存：原始实例 → (rootKey → 对应的 Proxy)
   *
   * Service 是「先取实例、再调方法」的模式，同一个实例会被反复取用
   * （典型如 `Session.getMsgService()`），每次重新包一层 Proxy 纯属浪费，
   * 而且会让同一个 Service 在多次调用间不是同一个对象身份。
   *
   * 只服务于 Service：Listener 等场景必须每次都是新对象
   * （重复 add 就是要挂多个监听器，复用会把它们合并成一个）。
   *
   * 用 WeakMap 作第一层，原始实例被回收后缓存自动释放，不会把 QQ 的实例吊住。
   * 第二层按 rootKey 区分，是因为同一个实例可能挂在不同的调用路径下，
   * 而 key 前缀会进入调试面板的 callPath 和拦截器匹配，不能串味。
   */
  #serviceInstanceCache = new WeakMap<Record<string, any>, Map<string, Record<string, any>>>()

  constructor(
    public debugServer: NodeDebugger,
    public Wrapper?: Wrapper,
    public Session?: NodeIQQNTWrapperSession,
    public config: ConfigType = {},
  ) {}

  /**
   * 用于打印函数调用结果
   */
  logFn({
    argArray,
    applyRet,
    key,
    status,
  }: {
    argArray: unknown[]
    applyRet: unknown
    key: string
    status?: FnTracePayload['status']
  }) {
    if (applyRet instanceof Promise) {
      applyRet.then(
        (res) => {
          this.debugServer.sendTrace({
            callPath: key,
            requestParams: argArray,
            responseParams: res,
            status: 'ok',
            type: 'AsyncFunction',
          })
        },
        (err) => {
          this.debugServer.sendTrace({
            callPath: key,
            requestParams: argArray,
            responseParams: err,
            status: 'error',
            type: 'AsyncFunction',
          })
        },
      )
    } else {
      const type = getTargetKeyword(key)
      this.debugServer.sendTrace({
        callPath: key,
        requestParams: argArray,
        responseParams: type === 'Service' ? listInstanceMethods(applyRet) : applyRet,
        type,
        status,
      })
    }
  }

  /**
   * Hook Wrapper 中的实例对象
   *
   * 默认每次都新建 Proxy；只有 `cache: true`（Service 专用）才复用同一实例的包装结果。
   */
  hookInstance({
    instance,
    rootKey,
    cache = false,
  }: {
    instance: Record<string, any>
    rootKey: string
    /** 只给 Service 用：同一实例 + 同一 rootKey 复用同一个 Proxy */
    cache?: boolean
  }) {
    // 只有对象才能被代理。Service 在未登录等场景下可能返回 undefined，
    // 直接 new Proxy 会抛 TypeError，把调用方一起带崩
    if (typeof instance !== 'object' || instance === null) return instance

    // Promise 不是 Service 实例（异步取 Service 时拿到的是 Promise 本身），
    // 代理它只会把 then/catch 也包一层，语义混乱且没有收益
    if (instance instanceof Promise) return instance

    if (cache) {
      const cachedProxy = this.#serviceInstanceCache.get(instance)?.get(rootKey)
      if (cachedProxy) return cachedProxy
    }

    const proxy = new Proxy(instance, {
      get: (_, p: string, receiver) => {
        const targetProperty = Reflect.get(instance, p, receiver)
        if (typeof targetProperty !== 'function') return targetProperty

        // 先生真乃盖世神医
        // return Reflect.get(target, p, receiver).bind(instance)

        const key = `${rootKey}/${p}`

        return (...args: any[]) => {
          // 拦截黑名单事件
          const isReturn = this.config.eventBlacklist?.some((value) => {
            if (typeof value === 'string') {
              return key === value
            } else {
              return value.test(key)
            }
          })
          if (isReturn) {
            // oxlint-disable-next-line typescript/no-unsafe-enum-comparison -- key 是运行时拼出的字符串，与字符串枚举比较是预期行为
            if (key !== WrapperEventEnum.sendLog) {
              this.logFn({
                argArray: args,
                applyRet: undefined,
                key,
                status: 'cancel',
              })
            }
            return
          }

          // 特殊处理 Listener
          if (key.endsWith('Listener')) {
            // add
            if (p.startsWith('add')) {
              const listenerList = this.#listenerMap.get(key)

              // 别忘了 hook 监听器
              args[0] = this.hookInstance({
                instance: args[0],
                rootKey: key,
              })

              if (listenerList) {
                listenerList.add(args[0])
              } else {
                this.#listenerMap.set(key, new Set([args[0]]))
              }
            }
            // remove，据说只有大量Q群的情况下才会触发
            else {
              const listenerList = this.#listenerMap.get(key.replace('/remove', '/add'))

              if (listenerList) {
                listenerList.delete(args[0])
              }
            }
          }

          try {
            // 请求拦截器
            args =
              (() => {
                // @ts-expect-error  忽略此处错误
                if (!this.config.eventInterceptors?.[key]) return
                // @ts-expect-error  忽略此处错误
                if (Array.isArray(this.config.eventInterceptors[key])) {
                  // @ts-expect-error  忽略此处错误
                  return this.config.eventInterceptors[key].reduce((acc, interceptor) => {
                    return interceptor(acc ?? args)
                  }, args)
                }
                // @ts-expect-error  忽略此处错误
                return this.config.eventInterceptors?.[key]?.(args)
              })() ?? args

            // 触发！
            let applyRet = instance[p](...args)

            // 响应拦截器
            applyRet =
              (() => {
                // @ts-expect-error  忽略此处错误
                if (!this.config.eventInterceptors?.[`${key}:response`]) return
                if (
                  // @ts-expect-error  忽略此处错误
                  Array.isArray(this.config.eventInterceptors[`${key}:response`])
                ) {
                  // @ts-expect-error  忽略此处错误
                  return this.config.eventInterceptors[`${key}:response`].reduce(
                    // @ts-expect-error  忽略此处错误
                    (acc, interceptor) => {
                      return interceptor({
                        applyRet: acc ?? applyRet,
                        params: args,
                      })
                    },
                    applyRet,
                  )
                }
                // @ts-expect-error  忽略此处错误
                return this.config.eventInterceptors?.[`${key}:response`]?.({
                  applyRet,
                  params: args,
                })
              })() ?? applyRet

            // Service 需额外处理：同一实例复用同一个 Proxy（cache: true）
            if (key.endsWith('Service')) {
              applyRet = this.hookInstance({
                instance: applyRet as Record<string, unknown>,
                rootKey: key,
                cache: true,
              })
            }

            // 额外派发的emitter
            if (applyRet instanceof Promise) {
              applyRet.then(
                (res) => {
                  const emitData = {
                    applyRet: res,
                    params: args,
                  }
                  // @ts-expect-error  - 我都有点看不太懂了
                  this.wrapperEmitter.emit(key, emitData)
                },
                (err) => {
                  const emitData = {
                    applyRet: err,
                    params: args,
                  }
                  // @ts-expect-error  - 我都有点看不太懂了
                  this.wrapperEmitter.emit(key, emitData)
                },
              )
            } else {
              const emitData = {
                applyRet,
                params: args,
              }
              // @ts-expect-error  - 我都有点看不太懂了
              this.wrapperEmitter.emit(key, emitData)
            }

            this.logFn({
              argArray: args,
              applyRet,
              key,
            })

            return applyRet
          } catch (error) {
            this.logFn({
              argArray: args,
              applyRet: error,
              key,
              status: 'error',
            })
            throw error
          }
        }
      },
    })

    // 只有 Service 才写缓存；其余场景（Listener、Wrapper 实例）每次都是全新包装
    if (cache) {
      const cachedByRootKey = this.#serviceInstanceCache.get(instance)
      if (cachedByRootKey) {
        cachedByRootKey.set(rootKey, proxy)
      } else {
        this.#serviceInstanceCache.set(instance, new Map([[rootKey, proxy]]))
      }
    }

    return proxy
  }

  /**
   * 调用 QQ 内部 Listener 事件
   */
  dispatchListener<T extends ListenerPaths>(
    eventPath: T,
    params: Parameters<WrapperResolvePath<T>>,
  ): ReturnType<WrapperResolvePath<T>>[] {
    const lastIndex = eventPath.lastIndexOf('/')
    const listenerName = eventPath.slice(0, lastIndex)
    const eventName = eventPath.slice(lastIndex + 1)

    const listenerList = this.#listenerMap.get(listenerName)

    if (!listenerList) throw new Error('监听器尚未绑定，请确认参数是否正确')

    return [...listenerList].map((callbacks) => {
      if (!callbacks[eventName]) throw new Error('未找到目标监听器')
      return callbacks[eventName](...params) as any
    })
  }
}
