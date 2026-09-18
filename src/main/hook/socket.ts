import net from "node:net";
import { inspect } from "node:util";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import { Utils } from "src/utils";

export interface FnTracePayload {
  callTime?: number;
  callPath?: string;
  type?: "Function" | "AsyncFunction" | "Service" | "Listener";
  status?: "ok" | "error" | "cancel";
  requestParams?: unknown[]; // 序列化后的字符串
  responseParams?: unknown; // 序列化后的字符串
  id?: string;
}

export class NodeDebugger {
  private io: Server | undefined;
  private mainSocket: Socket | null = null;
  public defaultPort: number = 3666; // 默认端口（可自定义）

  // 本地缓存队列，最大支持 200 条
  private traceQueue: Array<Record<string, unknown>> = [];
  private readonly MAX_QUEUE_SIZE = 200;

  constructor() {
    // 初始化服务器（自动找可用端口）
    this.initServerWithAvailablePort(this.defaultPort);
  }

  /**
   * 推送数据到前端（未连接时自动本地缓存最大 200 条，初始化连接完成后再推送）
   */
  public sendTrace(options: FnTracePayload): void {
    const {
      callPath,
      type = "Function",
      requestParams,
      responseParams,
      status = "ok",
      id = crypto.randomUUID(),
    } = options;

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
    };

    if (this.mainSocket && this.mainSocket.connected) {
      // Socket 已连接，直接推送
      this.mainSocket.emit("fn-trace", payload);
    } else {
      // Socket 未就绪，入队缓存
      if (this.traceQueue.length >= this.MAX_QUEUE_SIZE) {
        this.traceQueue.shift(); // 超过 200 条时丢弃最老的一条
      }
      this.traceQueue.push(payload);
    }
  }

  /**
   * 刷新并推送队列中的缓存数据
   */
  private flushTraceQueue(): void {
    if (!this.mainSocket || this.traceQueue.length === 0) return;

    Utils.log(`📦 正在向网页调试端推送 ${this.traceQueue.length} 条缓存数据...`);
    while (this.traceQueue.length > 0) {
      const payload = this.traceQueue.shift();
      if (payload) {
        this.mainSocket.emit("fn-trace", payload);
      }
    }
  }

  private async runDynamicCode(code: string): Promise<void> {
    if (!this.mainSocket) return;

    // Utils.log(`[Remote Execute]: ${code}`)

    try {
      const fn = new Function(`return (async () => { ${code.trim()} })()`);

      const res = await fn();

      Utils.log(`[Remote Execute]:`);
      console.log(
        inspect(res, {
          depth: null,
          colors: true,
        }),
      );

      this.mainSocket.emit("execute-result", {
        success: 0,
        res,
      });
    } catch (err) {
      console.error(`\n❌ [Remote Execute Error]:`);
      console.error(inspect(err, { depth: null, colors: true }));

      this.mainSocket.emit("execute-result", {
        success: 1,
        res: err instanceof Error ? err.message : String(err),
      });
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
        .once("error", () => resolve(false))
        .once("listening", () => {
          tester.close(() => resolve(true));
        })
        .listen(port);
    });
  }

  /**
   * 自动查找可用端口并初始化服务器
   * @param startPort 起始检测端口
   */
  private async initServerWithAvailablePort(startPort: number): Promise<void> {
    let currentPort = startPort;
    const maxRetry = 100; // 最大重试次数，避免无限循环
    let retryCount = 0;

    // 循环检测端口，直到找到可用端口或达到最大重试次数
    while (retryCount < maxRetry) {
      const available = await this.isPortAvailable(currentPort);
      if (available) {
        // 找到可用端口，创建服务器
        this.io = new Server(currentPort, {
          cors: { origin: "*" },
        });
        Utils.log(`✅ 调试服务器启动成功，端口：${currentPort}`);
        this.setupSocketListeners(); // 绑定 socket 事件
        this.defaultPort = currentPort;
        return;
      }

      Utils.log(`⚠️ 端口 ${currentPort} 已被占用，尝试下一个端口 ${currentPort + 1}`);
      currentPort++;
      retryCount++;
    }

    // 达到最大重试次数仍未找到可用端口
    throw new Error(`❌ 无法启动调试服务器：从 ${startPort} 开始的 ${maxRetry} 个端口均被占用`);
  }

  /**
   * 绑定 Socket 事件监听（抽离出来便于复用）
   */
  private setupSocketListeners(): void {
    this.io?.on("connection", (socket: Socket) => {
      Utils.log(`🚀 网页调试端已连接: ${socket.id}`);
      this.mainSocket = socket;

      // 连接成功后，推送积压的缓存消息
      this.flushTraceQueue();

      socket.on("disconnect", () => {
        Utils.log("📴 网页调试端已断开");
        this.mainSocket = null;
      });

      // 接收前端发送的代码字符串
      socket.on("execute-code", (code: string) => {
        this.runDynamicCode(code);
      });
    });
  }
}
