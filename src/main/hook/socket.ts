import type { Socket } from 'socket.io'
import { inspect } from 'node:util'
import { Server } from 'socket.io'
import { Utils } from 'src/utils'

export interface FnTracePayload {
  callTime?: number
  callPath?: string
  type?: 'Function' | 'AsyncFunction' | 'Service' | 'Listener'
  status?: 'ok' | 'error' | 'cancel'
  requestParams?: unknown[] // 序列化后的字符串
  responseParams?: unknown // 序列化后的字符串
  id?: string
}

class NodeDebugger {
  private io: Server
  private mainSocket: Socket | null = null

  constructor(port: number) {
    this.io = new Server(port, {
      cors: { origin: '*' },
    })

    this.io.on('connection', (socket: Socket) => {
      Utils.log(`🚀 网页调试端已连接: ${socket.id}`)
      this.mainSocket = socket

      socket.on('disconnect', () => {
        Utils.log('📴 网页调试端已断开')
        this.mainSocket = null
      })

      // 接收前端发送的代码字符串
      socket.on('execute-code', (code: string) => {
        this.runDynamicCode(code)
      })
    })
  }

  /**
   * 推送数据到前端
   */
  public sendTrace(options: FnTracePayload): void {
    if (!this.mainSocket)
      return

    const { callPath, type = 'Function', requestParams, responseParams, status = 'ok', id = crypto.randomUUID() } = options

    const payload = {
      callTime: Date.now(),
      callPath,
      type,
      status,
      requestParams: inspect(requestParams, {
        depth: null,
        maxArrayLength: null,
      }),
      responseParams: inspect(responseParams, {
        depth: null,
        maxArrayLength: null,
      }),
      id,
    }

    this.mainSocket.emit('fn-trace', payload)
  }

  private async runDynamicCode(code: string): Promise<void> {
    if (!this.mainSocket)
      return

    // Utils.log(`[Remote Execute]: ${code}`)

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (async () => { ${code.trim()} })()`)

      const res = await fn()

      Utils.log(`[Remote Execute]:`)
      console.log(inspect(res, {
        depth: null,
        colors: true,
      }))

      this.mainSocket.emit('execute-result', {
        success: 0,
        res,
      })
    }
    catch (err) {
      console.error(`\n❌ [Remote Execute Error]:`)
      console.error(inspect(err, { depth: null, colors: true }))

      this.mainSocket.emit('execute-result', {
        success: 1,
        res: err instanceof Error ? err.message : String(err),
      })
    }
  }
}

export const debugServer = new NodeDebugger(3666)
