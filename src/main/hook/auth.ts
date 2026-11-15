import { randomBytes, timingSafeEqual } from 'node:crypto'

import type { Socket } from 'socket.io'

/**
 * 会话密钥：**模块级生成，进程内唯一**。
 *
 * 插件主进程随 QQ 启动只加载一次，所以这个值天然满足
 * 「每次 QQ 启动生成一个，之后整个进程内不变」。
 *
 * 用 24 字节（192 bit）base64url，暴力猜测不可行；
 * 不用 UUID 是因为它只有 122 bit 且格式固定，容易被针对性构造。
 */
export const DEBUG_TOKEN = randomBytes(24).toString('base64url')

/**
 * 默认放行的来源。
 *
 * 注意：Origin 检查只是纵深防御的**第二道**，真正的边界是令牌。
 * 因为 Origin 是客户端自己发的、可以被脚本伪造；但它能挡住
 * 「用户随便访问的网页偷偷连 localhost」这类最廉价的攻击面。
 */
export const DEFAULT_ALLOWED_ORIGINS: (string | RegExp)[] = [
  // 官方 DevTools 站点
  'https://nyaruhodoo.github.io',
  // 本地开发（vite dev / preview）
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  // 直接打开本地构建产物时浏览器会送 Origin: null
  'null',
]

export interface GuardOptions {
  /** 期望的令牌 */
  token: string
  /** 允许的 Origin，空数组表示不校验 */
  allowedOrigins?: (string | RegExp)[]
  /** 拒绝回调，用于打日志 */
  onReject?: (reason: 'origin' | 'token', detail: string) => void
}

/** 常量时间比较，避免通过响应时间侧信道逐字节猜令牌 */
export function isTokenValid(input: unknown, expected: string): boolean {
  if (typeof input !== 'string' || input.length !== expected.length) return false

  try {
    return timingSafeEqual(Buffer.from(input, 'utf8'), Buffer.from(expected, 'utf8'))
  } catch {
    return false
  }
}

export function isOriginAllowed(origin: string | undefined, allowed: (string | RegExp)[]): boolean {
  if (allowed.length === 0) return true
  // 非浏览器客户端（本地脚本、Electron 主进程）不带 Origin，交给令牌把关
  if (!origin) return true

  return allowed.some((rule) => (typeof rule === 'string' ? rule === origin : rule.test(origin)))
}

/**
 * 从握手信息里取令牌。
 *
 * 优先用 socket.io 的 `auth` 载荷（走 CONNECT 包体，不会进 URL / 日志），
 * 同时兼容 `?token=` 查询串，方便手动调试。
 */
export function extractToken(handshake: { auth?: Record<string, unknown>; query?: Record<string, unknown> }): unknown {
  const fromAuth = handshake.auth?.token
  if (typeof fromAuth === 'string') return fromAuth

  const fromQuery = handshake.query?.token
  if (typeof fromQuery === 'string') return fromQuery
  if (Array.isArray(fromQuery)) return fromQuery[0]

  return undefined
}

/**
 * socket.io 鉴权中间件。
 *
 * 必须在 CONNECT 阶段就把非法连接掐掉 —— 一旦 `connection` 事件触发，
 * 客户端就能收到后续所有广播，也能 emit `execute-code`（等于 QQ 进程内的 RCE）。
 */
export function createAuthGuard(options: GuardOptions) {
  const allowedOrigins = options.allowedOrigins ?? DEFAULT_ALLOWED_ORIGINS

  return (socket: Socket, next: (err?: Error) => void): void => {
    const origin = socket.handshake.headers.origin

    if (!isOriginAllowed(origin, allowedOrigins)) {
      options.onReject?.('origin', origin ?? '(空)')
      next(new Error('origin-not-allowed'))
      return
    }

    if (!isTokenValid(extractToken(socket.handshake), options.token)) {
      options.onReject?.('token', `origin=${origin ?? '(空)'} ip=${socket.handshake.address}`)
      next(new Error('invalid-token'))
      return
    }

    next()
  }
}
