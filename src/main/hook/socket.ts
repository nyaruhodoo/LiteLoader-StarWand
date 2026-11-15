import net from 'node:net'
import { inspect } from 'node:util'

import type { Socket } from 'socket.io'
import { Server } from 'socket.io'

import { Utils } from '@/utils'

import type { GuardOptions } from './auth'
import { createAuthGuard, DEBUG_TOKEN, DEFAULT_ALLOWED_ORIGINS } from './auth'
import type { SerializedValue, SerializeOptions } from './serialize'
import { encodeValue, SERIALIZED_VERSION } from './serialize'

/** 调试端连接所需的信息，由渲染层拼进 DevTools 地址 */
export interface DebugInfo {
  port: number
  token: string
}

/**
 * 调用方传入的原始数据（未编码）。
 * 这里刻意保留 `unknown`，让调用方随便丢什么进来都行，
 * 编码交给 encodeValue 兜底。
 */
export interface FnTracePayload {
  callTime?: number
  callPath?: string
  type?: 'Function' | 'AsyncFunction' | 'Service' | 'Listener'
  status?: 'ok' | 'error' | 'cancel'
  requestParams?: unknown
  responseParams?: unknown
  id?: string
}

/**
 * 真正发到网页端的结构（已编码）。
 *
 * 与 FnTracePayload 的区别只有一点：`requestParams` / `responseParams`
 * 从任意 JS 值变成了信封树，能安全穿过 socket.io 的 JSON 序列化。
 */
export interface FnTraceEvent {
  /** 线上格式版本，前端据此决定渲染逻辑 */
  v: number
  id: string
  callTime: number
  callPath?: string
  type: NonNullable<FnTracePayload['type']>
  status: NonNullable<FnTracePayload['status']>
  /** 单次编码是否发生了截断，前端可给个提示角标 */
  truncated?: boolean
  requestParams: SerializedValue
  responseParams: SerializedValue
}

export interface ExecuteResultEvent {
  id: string
  ok: boolean
  /** 执行结果 / 错误对象的信封树 */
  result: SerializedValue
  durationMs: number
}

export class NodeDebugger {
  private io: Server | undefined
  private mainSocket: Socket | null = null
  public defaultPort: number = 3666 // 默认端口（可自定义）

  /**
   * 本次 QQ 启动期内的会话密钥。
   * 只会通过 IPC 交给渲染层拼进 DevTools 地址，不会出现在任何日志里。
   */
  public readonly token: string = DEBUG_TOKEN

  /**
   * 允许连接的来源。默认只放行官方 DevTools 站点与本地开发端口，
   * 需要自定义部署时往这里 push 即可。
   */
  public allowedOrigins: (string | RegExp)[] = [...DEFAULT_ALLOWED_ORIGINS]

  /** 鉴权失败次数，仅用于提示「有人在戳端口」 */
  private authFailures = 0

  /** 端口探测是异步的，用它通知「链接信息已就绪」 */
  private readonly readySignal = Promise.withResolvers<void>()

  /** 编码预算，可按需在初始化前调大 */
  public encodeOptions: SerializeOptions = {}

  // 本地缓存队列，最大支持 200 条
  private traceQueue: FnTraceEvent[] = []
  private readonly MAX_QUEUE_SIZE = 200
  /** 队列溢出时被丢弃的条数，恢复连接后告知前端，避免「数据凭空消失」 */
  private droppedCount = 0

  constructor() {
    // 初始化服务器（自动找可用端口）
    void this.initServerWithAvailablePort(this.defaultPort)
  }

  /**
   * 推送数据到前端（未连接时自动本地缓存最大 200 条，初始化连接完成后再推送）
   */
  public sendTrace(options: FnTracePayload): void {
    const {
      callPath,
      type = 'Function',
      requestParams,
      responseParams,
      status = 'ok',
      id = crypto.randomUUID(),
    } = options

    // 未连接且队列已满：先丢弃，连编码都省掉
    if (
      (!this.mainSocket || !this.mainSocket.connected) &&
      this.traceQueue.length >= this.MAX_QUEUE_SIZE
    ) {
      this.traceQueue.shift()
      this.droppedCount += 1
    }

    /**
     * 整个编码过程必须容错。
     * 这是在 QQ 的 API 调用链内部同步执行的，任何异常都会顺着
     * 调用栈污染到宿主程序，调试功能再重要也不能带崩 QQ。
     */
    let event: FnTraceEvent
    try {
      const request = encodeValue(requestParams, this.encodeOptions)
      const response = encodeValue(responseParams, this.encodeOptions)

      event = {
        v: SERIALIZED_VERSION,
        id,
        callTime: Date.now(),
        callPath,
        type,
        status,
        truncated: isTruncated(request) || isTruncated(response) || undefined,
        requestParams: request,
        responseParams: response,
      }
    } catch (err) {
      Utils.log('⚠️ 序列化调用数据失败，已跳过该条记录', err)
      return
    }

    if (this.mainSocket && this.mainSocket.connected) {
      // Socket 已连接，直接推送
      this.emit('fn-trace', event)
    } else {
      // Socket 未就绪，入队缓存（上面已保证不会超限）
      this.traceQueue.push(event)
    }
  }

  /**
   * 统一出口：集中处理连接状态与序列化异常。
   *
   * socket.io 的 emit 在遇到无法序列化的值时是可能抛错的，
   * 这里兜一层，避免一条脏数据打断整个调试通道。
   */
  private emit(event: string, payload: unknown): void {
    const socket = this.mainSocket
    if (!socket || !socket.connected) return

    try {
      socket.emit(event, payload)
    } catch (err) {
      console.error(`❌ 推送 ${event} 失败：`, inspect(err, { depth: 3, colors: true }))
    }
  }

  /**
   * 供渲染层获取连接信息（实际端口 + 本次启动的会话密钥）。
   *
   * 密钥只在这里被取出，走 IPC 直达插件自己的设置页，
   * 不会写进日志、也不会出现在任何广播里。
   */
  public async getDebugInfo(): Promise<DebugInfo> {
    // 端口探测是异步的，等它确定下来再给链接，否则可能把 3666 这个初始猜测发出去
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 3000)
      void this.readySignal.promise.then(() => {
        clearTimeout(timer)
        resolve()
      })
    })

    return { port: this.defaultPort, token: this.token }
  }

  /**
   * 刷新并推送队列中的缓存数据
   */
  private flushTraceQueue(): void {
    if (!this.mainSocket || !this.mainSocket.connected) return

    if (this.droppedCount > 0) {
      this.emit('fn-trace-dropped', { count: this.droppedCount })
      this.droppedCount = 0
    }

    if (this.traceQueue.length === 0) return

    Utils.log(`📦 正在向网页调试端推送 ${this.traceQueue.length} 条缓存数据...`)
    while (this.traceQueue.length > 0) {
      const payload = this.traceQueue.shift()
      if (payload) this.emit('fn-trace', payload)
    }
  }

  private async runDynamicCode(code: string, requestId: string): Promise<void> {
    if (!this.mainSocket) return

    const startAt = Date.now()

    try {
      // oxlint-disable-next-line typescript/no-implied-eval -- 调试服务端的核心能力就是执行网页端传来的代码
      const fn = new Function(`return (async () => { ${code.trim()} })()`)

      const res: unknown = await fn()

      // 本地控制台保留 inspect 的可读性，线上走结构化信封
      Utils.log(`[Remote Execute]:`)
      console.log(inspect(res, { depth: null, colors: true }))

      const result: ExecuteResultEvent = {
        id: requestId,
        ok: true,
        result: encodeValue(res, this.encodeOptions),
        durationMs: Date.now() - startAt,
      }
      this.emit('execute-result', result)
    } catch (err) {
      console.error(`\n❌ [Remote Execute Error]:`)
      console.error(inspect(err, { depth: null, colors: true }))

      const result: ExecuteResultEvent = {
        id: requestId,
        ok: false,
        result: encodeValue(err, this.encodeOptions),
        durationMs: Date.now() - startAt,
      }
      this.emit('execute-result', result)
    }
  }

  /**
   * 检测端口是否可用
   * @param port 要检测的端口号
   * @returns boolean 端口是否可用
   */
  private async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const tester = net
        .createServer()
        .once('error', () => resolve(false))
        .once('listening', () => {
          tester.close(() => resolve(true))
        })
        .listen(port)
    })
  }

  /**
   * 自动查找可用端口并初始化服务器
   * @param startPort 起始检测端口
   */
  private async initServerWithAvailablePort(startPort: number): Promise<void> {
    let currentPort = startPort
    const maxRetry = 100 // 最大重试次数，避免无限循环
    let retryCount = 0

    // 循环检测端口，直到找到可用端口或达到最大重试次数
    while (retryCount < maxRetry) {
      const available = await this.isPortAvailable(currentPort)
      if (available) {
        // 找到可用端口，创建服务器
        this.io = new Server(currentPort, {
          // 只对白名单来源放开跨域；WebSocket 本身不受 CORS 约束，
          // 真正的准入判断在下面的 authGuard 里
          cors: { origin: this.allowedOrigins },
        })

        this.io.use(
          createAuthGuard({
            token: this.token,
            allowedOrigins: this.allowedOrigins,
            onReject: (reason, detail) => {
              this.authFailures += 1
              const text =
                reason === 'origin'
                  ? `来源不在白名单内：${detail}`
                  : `令牌校验失败（${detail}）`

              Utils.log(`⛔ 拒绝调试端连接：${text}，累计 ${this.authFailures} 次`)

              // 被反复戳端口时给个明确提示，避免用户以为面板坏了
              if (this.authFailures === 5) {
                Utils.log('💡 若非本人操作，请检查是否有其他程序在扫描本机调试端口')
              }
            },
          } satisfies GuardOptions),
        )

        Utils.log(`✅ 调试服务器启动成功，端口：${currentPort}`)
        this.setupSocketListeners() // 绑定 socket 事件
        this.defaultPort = currentPort
        this.readySignal.resolve()
        return
      }

      Utils.log(`⚠️ 端口 ${currentPort} 已被占用，尝试下一个端口 ${currentPort + 1}`)
      currentPort++
      retryCount++
    }

    // 达到最大重试次数仍未找到可用端口
    this.readySignal.resolve()
    throw new Error(`❌ 无法启动调试服务器：从 ${startPort} 开始的 ${maxRetry} 个端口均被占用`)
  }

  /**
   * 绑定 Socket 事件监听（抽离出来便于复用）
   */
  private setupSocketListeners(): void {
    this.io?.on('connection', (socket: Socket) => {
      Utils.log(`🚀 网页调试端已连接: ${socket.id}`)
      this.mainSocket = socket

      // 连接成功后，推送积压的缓存消息
      this.flushTraceQueue()

      socket.on('disconnect', () => {
        Utils.log('📴 网页调试端已断开')
        // 只在自己仍是当前连接时才清空，避免后连接的端被先断开的顶掉
        if (this.mainSocket?.id === socket.id) this.mainSocket = null
      })

      // 接收前端发送的代码字符串
      socket.on('execute-code', (payload: unknown) => {
        // 兼容「裸字符串」和「带 id 的对象」两种写法
        if (typeof payload === 'string') {
          void this.runDynamicCode(payload, crypto.randomUUID())
          return
        }

        const rec = payload as { code?: unknown; id?: unknown } | null
        if (rec && typeof rec.code === 'string') {
          void this.runDynamicCode(
            rec.code,
            typeof rec.id === 'string' ? rec.id : crypto.randomUUID(),
          )
        }
      })
    })
  }
}

/** 判断编码结果里是否出现了截断标记，用于前端打提示 */
function isTruncated(node: SerializedValue): boolean {
  if (node.t === 'cut') return true
  if (node.t === 'str') return node.len !== undefined
  if (node.t === 'arr' || node.t === 'set')
    return node.more !== undefined || node.v.some(isTruncated)
  if (node.t === 'map') {
    return node.more !== undefined || node.v.some(([k, v]) => isTruncated(k) || isTruncated(v))
  }
  if (node.t === 'obj') {
    return node.more !== undefined || Object.values(node.v).some(isTruncated)
  }

  return false
}
