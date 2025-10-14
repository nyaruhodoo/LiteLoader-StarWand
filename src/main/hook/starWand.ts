import type {
  ListenerPaths,
  Wrapper,
  WrapperEventMap,
  WrapperInterceptors,
  WrapperPaths,
  WrapperResolvePath,
} from '@/types/wrapper/core'
import type { NodeIQQNTWrapperSession } from '@/types/wrapper/core/NodeIQQNTWrapperSession'
import { EventEmitter } from 'node:events'
import { inspect } from 'node:util'

export interface ConfigType {
  /**
   * 是否开启log
   */
  log?: boolean | RegExp
  /**
   * 调整 inspect 模式下的打印深度
   */
  logDepth?: number | null
  /**
   * json 可以完整打印，inspect 格式更好看
   */
  logType?: 'inspect' | 'json'
  /**
   * 需要中断的黑名单事件
   */
  eventBlacklist?: (WrapperPaths | RegExp)[]
  /**
   * 事件拦截器，可以拦截请求参数以及返回值
   */
  eventInterceptors?: WrapperInterceptors
}

export class StarWand {
  wrapperEmitter = new EventEmitter<WrapperEventMap>()
  // 非必须的情况下不给很详细的类型，因为真的很卡 /(ㄒoㄒ)/~~
  #listenerMap = new Map<
    string,
    Set<Record<string, (...args: unknown[]) => void>>
  >()

  constructor(
    public Wrapper?: Wrapper,
    public Session?: NodeIQQNTWrapperSession,
    public config: ConfigType = {},
  ) {}

  /**
   * 用于打印函数调用结果(感觉有点low)
   */
  logFn({
    argArray,
    applyRet,
    key,
  }: {
    argArray: unknown[]
    applyRet: unknown
    key: string
  }) {
    if (!this.config.log)
      return
    if (typeof this.config.log !== 'boolean' && !this.config.log.test(key))
      return

    const depth = this.config.logDepth

    const logUtils = {
      inspect(params: unknown) {
        return inspect(params, { depth, colors: true })
      },
      json(params: unknown) {
        return JSON.stringify(params, null, 2)
      },
    }

    const log = logUtils[this.config.logType ?? 'inspect']

    console.log('-----------------------------------------------')
    console.log(`${key} 被调用`)
    argArray.length && console.log(`参数: `, log(argArray))

    if (applyRet instanceof Promise) {
      console.log('返回值为 Promise，请观察后续打印内容')
      applyRet.then(
        (res) => {
          console.log(`${key} 返回值: `)
          console.log(log(res))
        },
        (err) => {
          console.log(`${key} 返回值: `)
          console.log(log(err))
        },
      )
    }
    else {
      console.log(`返回值: `, log(applyRet))

      if (typeof applyRet === 'object' && applyRet) {
        const retPropertyNames = Object.getOwnPropertyNames(applyRet)
        retPropertyNames.length
        && console.log(`返回值 keys: `, log(retPropertyNames))

        console.log(
          `原型 keys: `,
          log(Object.getOwnPropertyNames(Object.getPrototypeOf(applyRet))),
        )
      }
    }
  }

  /**
   * Hook Wrapper 中的实例对象
   */
  hookInstance({
    instance,
    rootKey,
  }: {
    instance: Record<string, any>
    rootKey: string
  }) {
    return new Proxy(instance, {
      get: (_, p: string, receiver) => {
        const targetProperty = Reflect.get(instance, p, receiver)
        if (typeof targetProperty !== 'function')
          return targetProperty

        // 先生真乃盖世神医
        // return Reflect.get(target, p, receiver).bind(instance)

        const key = `${rootKey}/${p}`

        return (...args: any[]) => {
          // 拦截黑名单事件
          const isReturn = this.config.eventBlacklist?.some((value) => {
            if (typeof value === 'string') {
              return key === value
            }
            else {
              return value.test(key)
            }
          })
          if (isReturn)
            return

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
              }
              else {
                this.#listenerMap.set(key, new Set([args[0]]))
              }
            }
            // remove，据说只有大量Q群的情况下才会触发
            else {
              const listenerList = this.#listenerMap.get(
                key.replace('/remove', '/add'),
              )

              if (listenerList) {
                listenerList.delete(args[0])
              }
            }
          }

          // 请求拦截器
          args
            = (() => {
              // @ts-expect-error  忽略此处错误
              if (!this.config.eventInterceptors?.[key])
                return
              // @ts-expect-error  忽略此处错误
              if (Array.isArray(this.config.eventInterceptors[key])) {
                // @ts-expect-error  忽略此处错误
                return this.config.eventInterceptors[key].reduce(
                  (acc, interceptor) => {
                    return interceptor(acc ?? args)
                  },
                  args,
                )
              }
              // @ts-expect-error  忽略此处错误
              return this.config.eventInterceptors?.[key]?.(args)
            })() ?? args

          let applyRet = instance[p](...args)

          // 响应拦截器
          applyRet
            = (() => {
              // @ts-expect-error  忽略此处错误
              if (!this.config.eventInterceptors?.[`${key}:response`])
                return
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
              return this.config.eventInterceptors?.[`${key}:response`]?.(
                { applyRet, params: args },
              )
            })() ?? applyRet

          // Service 需额外处理
          if (key.endsWith('Service')) {
            applyRet = this.hookInstance({
              instance: applyRet as Record<string, unknown>,
              rootKey: key,
            })
          }

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
          }
          else {
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
        }
      },
    })
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

    if (!listenerList)
      throw new Error('监听器尚未绑定，请确认参数是否正确')

    return [...listenerList].map((callbacks) => {
      if (!callbacks[eventName])
        throw new Error('未找到目标监听器')
      return callbacks[eventName](...params) as any
    })
  }
}
