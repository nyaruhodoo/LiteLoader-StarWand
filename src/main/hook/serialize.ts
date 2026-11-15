import { Buffer } from 'node:buffer'

/**
 * 调试数据线上格式版本号。
 * 前端可据此判断是否需要兼容旧数据，破坏性改动时 +1 即可。
 */
export const SERIALIZED_VERSION = 1

/**
 * 一个值的「信封」形态。
 *
 * 设计要点：**标签与载荷物理隔离**。
 * 用户数据永远只存在于 `v` / 自有字段里，绝不会和 `t` 混在同一层，
 * 所以不存在「用户对象里本来就有 `__type` 字段」这类打标方案固有的键冲突 BUG。
 * 整个结构只由 string / number / boolean / null / 数组 / 纯对象 组成，
 * 可以安全通过 socket.io（JSON）传输。
 */
export type SerializedValue =
  | { t: 'undef' }
  | { t: 'null' }
  | { t: 'bool'; v: boolean }
  /** 普通数字放 number；NaN / ±Infinity / -0 这类 JSON 表达不了的值降级为字符串 */
  | { t: 'num'; v: number | string }
  /** 老版本 JSON.stringify 遇到 BigInt 会直接抛异常，必须单独编码 */
  | { t: 'bigint'; v: string }
  /** len 为原始长度，出现过截断时才带，用于提示「后面还有 N 字符」 */
  | { t: 'str'; v: string; len?: number }
  | { t: 'sym'; v: string }
  | { t: 'fn'; v: string; name?: string; kind?: string }
  | { t: 'date'; v: string }
  | { t: 'regexp'; v: string; lastIndex?: number }
  | {
      t: 'err'
      name: string
      message: string
      stack?: string
      cause?: SerializedValue
      /** Error 上的自定义字段（err.code / err.status 之类，排查时很关键） */
      extra?: Record<string, SerializedValue>
    }
  | { t: 'arr'; v: SerializedValue[]; more?: number; id?: number }
  | {
      t: 'obj'
      v: Record<string, SerializedValue>
      /** 类名，普通对象不带此字段 */
      ctor?: string
      more?: number
      id?: number
      /** 未被调用的 getter 名字（invokeGetter: false 时才有） */
      getters?: string[]
      /** 值来自原型上的 getter（而非自有属性），前端可用淡色区分 */
      fromProto?: string[]
    }
  | { t: 'map'; v: [SerializedValue, SerializedValue][]; more?: number; ctor?: string; id?: number }
  | { t: 'set'; v: SerializedValue[]; more?: number; ctor?: string; id?: number }
  /** WeakMap / WeakSet 内容不可枚举，只能报个类型 */
  | { t: 'weak'; ctor: string; id?: number }
  | {
      t: 'bin'
      ctor: string
      byteLength: number
      /** 体积在 maxBinaryBytes 以内才带完整 base64，方便前端还原图片/二进制 */
      b64?: string
      preview?: string
      id?: number
    }
  | { t: 'promise'; id?: number }
  /** 指向本棵树里 id 相同的节点。circ 为 true 表示这才是真正的循环引用 */
  | { t: 'ref'; v: number; circ?: true }
  /** 因超深 / 超量 / 抛出异常等原因被截断，v 是人类可读原因 */
  | { t: 'cut'; v: string }

/** 编码预算，全部是「保命」参数：宁可截断也不能让宿主卡死 */
export interface SerializeOptions {
  /** 最大递归深度，防止超深嵌套把栈撑爆 */
  maxDepth?: number
  /** 单次编码最多处理多少个节点，防止遍历巨量对象图 */
  maxNodes?: number
  /** 数组 / Map / Set 最多取多少项，剩余项数记入 more */
  maxArrayLength?: number
  /** 对象最多枚举多少个自有键，剩余键数记入 more */
  maxProps?: number
  /** 单个字符串最大长度，超出截断并记录原始长度 */
  maxStringLength?: number
  /** 二进制数据携带完整 base64 的字节上限 */
  maxBinaryBytes?: number
  /** 单次编码的粗略字节预算，超出后只输出 cut 节点 */
  maxBytes?: number
  /**
   * 是否主动执行 getter 取值。
   * 取 true 能看到更多数据，但 getter 可能有副作用（甚至抛错），
   * 极端性能敏感时改 false，改为在 getters 里列出名字。
   */
  invokeGetter?: boolean
  /** 是否采集原型链上的 getter（类实例的数据大多挂在这里） */
  collectProtoGetters?: boolean
  /** 是否携带 Error.stack */
  includeStack?: boolean
}

const DEFAULTS: Required<SerializeOptions> = {
  maxDepth: 12,
  maxNodes: 5000,
  maxArrayLength: 200,
  maxProps: 200,
  maxStringLength: 2000,
  maxBinaryBytes: 256,
  maxBytes: 512 * 1024,
  invokeGetter: true,
  collectProtoGetters: true,
  includeStack: true,
}

function normalizeOptions(options: SerializeOptions): Required<SerializeOptions> {
  const out: Required<SerializeOptions> = { ...DEFAULTS }

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      ;(out as Record<string, unknown>)[key] = value
    }
  }

  return out
}

interface EncodeCtx {
  o: Required<SerializeOptions>
  /** 已访问对象的 id 表。WeakMap 保证不会把宿主的对象图吊住 */
  ids: WeakMap<object, number>
  /**
   * 当前递归路径上的祖先集合。
   * 有了它才能区分「循环引用」（指向自己祖先，必须断链）
   * 和「共享引用」（同一个对象在兄弟节点出现，可以复用），前端展示策略不同
   */
  stack: Set<object>
  nextId: number
  nodes: number
  bytes: number
}

const sliceStr = (str: string, max: number): { v: string; len?: number } =>
  str.length > max ? { v: str.slice(0, max), len: str.length } : { v: str }

function safeTag(value: object): string {
  try {
    // 会触发 Symbol.toStringTag getter，Proxy 目标可能抛错
    return Object.prototype.toString.call(value).slice(8, -1)
  } catch {
    return 'Object'
  }
}

function ctorNameOf(value: object): string | undefined {
  try {
    const proto: { constructor?: { name?: unknown } } | null = Reflect.getPrototypeOf(value)
    if (!proto) return 'null-prototype'

    const name = proto.constructor?.name
    return typeof name === 'string' && name.length > 0 ? name : undefined
  } catch {
    return undefined
  }
}

/** 只对确定能安全字符串化的原始类型取值，其余一律返回空串 */
function toText(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }

  return ''
}

function encodeNumber(value: number): SerializedValue {
  if (Number.isNaN(value)) return { t: 'num', v: 'NaN' }
  if (value === Infinity) return { t: 'num', v: 'Infinity' }
  if (value === -Infinity) return { t: 'num', v: '-Infinity' }
  if (Object.is(value, -0)) return { t: 'num', v: '-0' }

  return { t: 'num', v: value }
}

/**
 * 把单次取值包进 try/catch。
 * 数组下标、对象属性、Map 迭代……只要底层是 Proxy，任何一步都可能抛错，
 * 而这个错误只能影响当前节点，绝不能冒泡出去。
 */
function guard(fn: () => SerializedValue, hint: string): SerializedValue {
  try {
    return fn()
  } catch (err) {
    return { t: 'cut', v: `${hint}时抛出：${String(err)}` }
  }
}

type AnyFunction = (...args: never[]) => unknown

function encodeFunction(fn: AnyFunction, ctx: EncodeCtx): SerializedValue {
  let text = 'function () { [native code] }'

  try {
    // Proxy 包过的函数 / 绑定函数拿不到源码时会抛错
    // oxlint-disable-next-line typescript/unbound-method -- this 由 Reflect.apply 显式指定为 fn，不存在丢失
    const raw: unknown = Reflect.apply(Function.prototype.toString, fn, [])
    if (typeof raw === 'string') text = raw
  } catch {
    // ignore
  }

  const name = typeof fn.name === 'string' && fn.name.length > 0 ? fn.name : undefined
  // 构造函数靠源码开头判断，比 constructor 字段可靠（箭头函数没有 prototype）
  const kind = /^class\s/.test(text) ? 'class' : fn.constructor?.name

  return {
    t: 'fn',
    ...sliceStr(text, ctx.o.maxStringLength),
    name,
    kind,
  }
}

function encodeError(err: object, ctx: EncodeCtx, depth: number): SerializedValue {
  const rec = err as { name?: unknown; message?: unknown; stack?: unknown; cause?: unknown }

  const node: Extract<SerializedValue, { t: 'err' }> = {
    t: 'err',
    name: typeof rec.name === 'string' ? rec.name : safeTag(err),
    message: toText(rec.message),
  }

  if (ctx.o.includeStack && typeof rec.stack === 'string') {
    node.stack = sliceStr(rec.stack, ctx.o.maxStringLength * 2).v
  }

  if (rec.cause !== undefined) {
    node.cause = walk(rec.cause, depth, ctx)
  }

  // Error 上的自定义字段（err.code 之类）藏起来最影响排查
  if (safeTag(err) !== 'Array') {
    const extra: Record<string, SerializedValue> = {}

    for (const key of safeKeys(err, ctx)) {
      if (EXTRA_ERROR_KEYS.has(key)) continue
      extra[key] = safeRead(err as Record<string, unknown>, key, ctx, depth)
    }

    if (Object.keys(extra).length > 0) node.extra = extra
  }

  return node
}

const EXTRA_ERROR_KEYS = new Set(['name', 'message', 'stack', 'cause'])

function encodeBinary(value: object, ctx: EncodeCtx): Extract<SerializedValue, { t: 'bin' }> {
  const isView = ArrayBuffer.isView(value)
  const byteLength = isView ? value.byteLength : (value as ArrayBuffer).byteLength

  const ctor = ctorNameOf(value) ?? safeTag(value)
  const node: Extract<SerializedValue, { t: 'bin' }> = { t: 'bin', ctor, byteLength }

  const toBuffer = (start: number, end: number): Buffer => {
    if (!isView) return Buffer.from((value as ArrayBuffer).slice(start, end))
    return Buffer.from(value.buffer as ArrayBuffer, value.byteOffset + start, end - start)
  }

  try {
    if (byteLength <= ctx.o.maxBinaryBytes) {
      // 小数据给完整 base64，前端能直接还原成图片 / 二进制
      node.b64 = toBuffer(0, byteLength).toString('base64')
    }
    // 无论大小都给个头部预览，大文件（图片、protobuf 包）也能看出特征
    if (byteLength > 0) {
      node.preview = `${toBuffer(0, Math.min(32, byteLength)).toString('hex')}${byteLength > 32 ? ' …' : ''}`
    }
  } catch {
    // 已被转移（detached）的 ArrayBuffer 取不到内容，忽略预览即可
  }

  return node
}

function safeKeys(value: object, ctx: EncodeCtx): string[] {
  try {
    // Object.keys 只会触发 ownKeys + getOwnPropertyDescriptor，不会执行 getter
    return Object.keys(value).slice(0, ctx.o.maxProps)
  } catch {
    return []
  }
}

function safeRead(
  source: Record<string, unknown>,
  key: string,
  ctx: EncodeCtx,
  depth: number,
): SerializedValue {
  return guard(() => walk(source[key], depth, ctx), `读取 ${key} `)
}

/** 读取自有属性描述符，用于识别 getter（不执行） */
function safeDescriptor(value: object, key: string): PropertyDescriptor | undefined {
  try {
    return Object.getOwnPropertyDescriptor(value, key)
  } catch {
    return undefined
  }
}

/**
 * 收集原型链上的 accessor 名字（最多向上 5 层）。
 * 类实例的真实数据常常挂在这里，不采集就只能看到一个空对象。
 */
function protoAccessorKeys(value: object, limit: number): string[] {
  const out: string[] = []

  try {
    let proto: object | null = Reflect.getPrototypeOf(value)
    let hops = 0

    while (proto && proto !== Object.prototype && hops < 5) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key === 'constructor' || out.includes(key)) continue

        const desc = Object.getOwnPropertyDescriptor(proto, key)
        // 只收 accessor（getter），原型上的普通方法不展开，否则每个实例都带一堆函数
        if (desc && typeof desc.get === 'function') out.push(key)
        if (out.length >= limit) return out
      }

      proto = Reflect.getPrototypeOf(proto)
      hops += 1
    }
  } catch {
    // 原型链异常（Proxy）时能拿多少算多少
  }

  return out
}

function walk(value: unknown, depth: number, ctx: EncodeCtx): SerializedValue {
  // ---- 原始类型 ------------------------------------------------
  switch (typeof value) {
    case 'undefined':
      return { t: 'undef' }
    case 'boolean':
      return { t: 'bool', v: value }
    case 'number':
      return encodeNumber(value)
    case 'string':
      ctx.bytes += value.length
      return { t: 'str', ...sliceStr(value, ctx.o.maxStringLength) }
    case 'bigint':
      return { t: 'bigint', v: value.toString() }
    case 'symbol':
      return { t: 'sym', v: value.toString() }
    case 'function':
      return encodeFunction(value as AnyFunction, ctx)
    case 'object':
      break
    default:
      return { t: 'cut', v: `未知 typeof：${typeof value}` }
  }

  if (value === null) return { t: 'null' }

  const obj = value

  // ---- 预算闸门 ------------------------------------------------
  ctx.nodes += 1
  if (ctx.nodes > ctx.o.maxNodes) {
    return { t: 'cut', v: `节点数超过上限 ${ctx.o.maxNodes}` }
  }
  if (ctx.bytes > ctx.o.maxBytes) {
    return { t: 'cut', v: `数据量超过上限 ${ctx.o.maxBytes} 字节` }
  }

  // ---- 引用处理（循环 / 共享）----------------------------------
  // 必须在递归子节点之前登记 id，否则自己指自己时找不到已登记的节点
  const existedId = ctx.ids.get(obj)
  if (existedId !== undefined) {
    return ctx.stack.has(obj) ? { t: 'ref', v: existedId, circ: true } : { t: 'ref', v: existedId }
  }

  const id = (ctx.nextId += 1)
  ctx.ids.set(obj, id)
  ctx.stack.add(obj)

  try {
    return classify(obj, id, depth, ctx)
  } catch (err) {
    // 走到这里说明这个节点自身炸了（典型是 Proxy 的 trap 抛错）。
    // 撤销 id 登记，否则后续 ref 会指向一棵树里根本不存在的节点
    ctx.ids.delete(obj)
    return { t: 'cut', v: `读取时抛出：${String(err)}` }
  } finally {
    // 出栈，保证「兄弟节点共享」不会被误判为循环
    ctx.stack.delete(obj)
  }
}

function classify(obj: object, id: number, depth: number, ctx: EncodeCtx): SerializedValue {
  if (depth >= ctx.o.maxDepth) {
    return { t: 'cut', v: `超过最大深度 ${ctx.o.maxDepth}（${ctorNameOf(obj) ?? 'Object'}）` }
  }

  const next = depth + 1

  // ---- 数组 ----------------------------------------------------
  if (Array.isArray(obj)) {
    const len = obj.length
    const take = Math.min(len, ctx.o.maxArrayLength)

    const items: SerializedValue[] = []
    for (let i = 0; i < take; i += 1) {
      // 稀疏数组的空洞会走到 undefined 分支，这是期望行为；
      // 但 Proxy 数组的下标读取可能抛错，所以要单独兜住
      items.push(guard(() => walk(obj[i], next, ctx), `读取下标 ${i} `))
    }

    const node: Extract<SerializedValue, { t: 'arr' }> = { t: 'arr', v: items, id }
    if (len > take) node.more = len - take

    return node
  }

  // ---- 二进制 --------------------------------------------------
  if (
    obj instanceof ArrayBuffer ||
    (typeof SharedArrayBuffer !== 'undefined' && obj instanceof SharedArrayBuffer) ||
    ArrayBuffer.isView(obj)
  ) {
    return { ...encodeBinary(obj, ctx), id }
  }

  const tag = safeTag(obj)

  // ---- 时间 / 正则 ---------------------------------------------
  if (tag === 'Date') {
    const time = (obj as Date).getTime()
    return { t: 'date', v: Number.isNaN(time) ? 'Invalid Date' : (obj as Date).toISOString() }
  }

  if (tag === 'RegExp') {
    const re = obj as RegExp
    return { t: 'regexp', v: String(re), lastIndex: re.lastIndex || undefined }
  }

  // ---- Error / DOMException ------------------------------------
  if (obj instanceof Error || tag === 'Error' || tag.endsWith('Error')) {
    return encodeError(obj, ctx, next)
  }

  // ---- Map / Set -----------------------------------------------
  if (tag === 'Map' || obj instanceof Map) {
    const map = obj as Map<unknown, unknown>
    const node: Extract<SerializedValue, { t: 'map' }> = { t: 'map', v: [], id }
    const ctor = ctorNameOf(obj)
    if (ctor && ctor !== 'Map') node.ctor = ctor

    let i = 0
    for (const [k, val] of map) {
      if (i >= ctx.o.maxArrayLength) break
      // Map 迭代本身也可能抛错（迭代到一半被 getter 打断），整体兜住并保留已取到的部分
      node.v.push([
        guard(() => walk(k, next, ctx), `读取 Map 键 ${i} `),
        guard(() => walk(val, next, ctx), `读取 Map 值 ${i} `),
      ])
      i += 1
    }
    if (map.size > i) node.more = map.size - i

    return node
  }

  if (tag === 'Set' || obj instanceof Set) {
    const set = obj as Set<unknown>
    const node: Extract<SerializedValue, { t: 'set' }> = { t: 'set', v: [], id }
    const ctor = ctorNameOf(obj)
    if (ctor && ctor !== 'Set') node.ctor = ctor

    let i = 0
    for (const item of set) {
      if (i >= ctx.o.maxArrayLength) break
      node.v.push(guard(() => walk(item, next, ctx), `迭代 Set 第 ${i} 项 `))
      i += 1
    }
    if (set.size > i) node.more = set.size - i

    return node
  }

  // ---- 不可枚举的弱引用 ----------------------------------------
  if (
    tag === 'WeakMap' ||
    tag === 'WeakSet' ||
    tag === 'WeakRef' ||
    tag === 'FinalizationRegistry'
  ) {
    return { t: 'weak', ctor: tag, id }
  }

  // ---- Promise（状态拿不到，只能标识）--------------------------
  if (tag === 'Promise') {
    return { t: 'promise', id }
  }

  // ---- 普通对象 / 类实例 ---------------------------------------
  const ctor = ctorNameOf(obj)
  const node: Extract<SerializedValue, { t: 'obj' }> = { t: 'obj', v: {}, id }
  if (ctor && ctor !== 'Object') node.ctor = ctor

  const keys = safeKeys(obj, ctx)
  const pendingGetters: string[] = []

  for (const key of keys) {
    const desc = safeDescriptor(obj, key)

    if (desc && typeof desc.get === 'function') {
      if (!ctx.o.invokeGetter) {
        pendingGetters.push(key)
        continue
      }
    }

    node.v[key] = safeRead(obj as Record<string, unknown>, key, ctx, next)
  }

  /**
   * 类实例的数据很多时候是通过原型上的 getter 暴露的，
   * 而 Object.keys 只能看到自有属性 —— 不补这一步，
   * 面板里就会出现一个 `Foo {}` 的空壳，什么都看不见。
   */
  const protoGetters = ctx.o.collectProtoGetters ? protoAccessorKeys(obj, ctx.o.maxProps) : []

  for (const key of protoGetters) {
    if (key in node.v) continue

    if (!ctx.o.invokeGetter) {
      pendingGetters.push(key)
      continue
    }

    node.v[key] = safeRead(obj as Record<string, unknown>, key, ctx, next)
    ;(node.fromProto ??= []).push(key)
  }

  if (pendingGetters.length > 0) node.getters = pendingGetters

  // 自有键被 maxProps 砍掉时提示一下，避免误以为对象就这么多字段
  try {
    const totalKeys = Object.keys(obj).length
    if (totalKeys > keys.length) node.more = totalKeys - keys.length
  } catch {
    // ignore
  }

  return node
}

/**
 * 把任意 JS 值编码成可 JSON 传输的信封树。
 *
 * 永不抛错：任何单个节点出问题都会被降级成 `cut` 节点，
 * 保证一个会抛错的 getter 不会连带把宿主程序的调用链一起炸掉。
 */
export function encodeValue(value: unknown, options: SerializeOptions = {}): SerializedValue {
  const ctx: EncodeCtx = {
    o: normalizeOptions(options),
    ids: new WeakMap(),
    stack: new Set(),
    nextId: 0,
    nodes: 0,
    bytes: 0,
  }

  try {
    return walk(value, 0, ctx)
  } catch (err) {
    return { t: 'cut', v: `编码失败：${String(err)}` }
  }
}

/* ------------------------------------------------------------------ */
/*                        以下为网页端使用                              */
/* ------------------------------------------------------------------ */

/** 收集树里所有带 id 的节点，供 ref 回填 */
function collectIds(node: SerializedValue, table: Map<number, SerializedValue>): void {
  if (typeof node !== 'object' || node === null) return

  const id = (node as { id?: number }).id
  if (typeof id === 'number') table.set(id, node)

  const t = node.t
  if (t === 'arr' || t === 'set') {
    for (const item of node.v) collectIds(item, table)
  } else if (t === 'obj') {
    for (const item of Object.values(node.v)) collectIds(item, table)
  } else if (t === 'map') {
    for (const [k, v] of node.v) {
      collectIds(k, table)
      collectIds(v, table)
    }
  } else if (t === 'err') {
    if (node.cause) collectIds(node.cause, table)
    if (node.extra) for (const item of Object.values(node.extra)) collectIds(item, table)
  }
}

/**
 * 把信封树还原成真实的 JS 值（循环引用会还原成真正的环）。
 *
 * 主要给「复制到控制台 / 二次处理」用；纯展示直接遍历信封树即可，
 * 不必还原——还原是可能失败的（比如函数、被截断的节点）。
 */
export function decodeValue(node: SerializedValue): unknown {
  const table = new Map<number, SerializedValue>()
  collectIds(node, table)

  // 已还原的节点缓存：保证同一 id 还原出同一个引用，环才能闭合
  const built = new Map<number, unknown>()

  const build = (current: SerializedValue): unknown => {
    switch (current.t) {
      case 'undef':
        return undefined
      case 'null':
        return null
      case 'bool':
        return current.v
      case 'num':
        // 'NaN' / 'Infinity' / '-Infinity' / '-0' 用 Number 都能正确还原
        return typeof current.v === 'number' ? current.v : Number(current.v)
      case 'bigint':
        return BigInt(current.v)
      case 'str':
        return current.v
      case 'sym':
        return current.v
      case 'fn':
        return `[Function${current.name ? `: ${current.name}` : ''}]`
      case 'date':
        return current.v === 'Invalid Date' ? new Date(Number.NaN) : new Date(current.v)
      case 'regexp': {
        const [, pattern = '', flags = ''] = /^\/(.*)\/([a-z]*)$/s.exec(current.v) ?? []
        return new RegExp(pattern, flags)
      }
      case 'err': {
        const err = new Error(current.message)
        err.name = current.name
        if (current.stack) err.stack = current.stack
        return err
      }
      case 'weak':
        return `[${current.ctor}]`
      case 'promise':
        return '[Promise]'
      case 'bin':
        return current.b64
          ? Uint8Array.from(Buffer.from(current.b64, 'base64'))
          : `[${current.ctor}]`
      case 'cut':
        return `[截断: ${current.v}]`
      case 'ref': {
        if (built.has(current.v)) return built.get(current.v)
        const target = table.get(current.v)
        return target ? build(target) : `[ref#${current.v}]`
      }
      case 'arr': {
        const arr: unknown[] = []
        if (current.id !== undefined) built.set(current.id, arr)
        for (const item of current.v) arr.push(build(item))
        return arr
      }
      case 'set': {
        const set = new Set<unknown>()
        if (current.id !== undefined) built.set(current.id, set)
        for (const item of current.v) set.add(build(item))
        return set
      }
      case 'map': {
        const map = new Map<unknown, unknown>()
        if (current.id !== undefined) built.set(current.id, map)
        for (const [k, v] of current.v) map.set(build(k), build(v))
        return map
      }
      case 'obj': {
        const obj: Record<string, unknown> = {}
        if (current.id !== undefined) built.set(current.id, obj)
        for (const [k, v] of Object.entries(current.v)) obj[k] = build(v)
        return obj
      }
      default:
        return undefined
    }
  }

  return build(node)
}

/**
 * 信封树 → 单行文本摘要，用于列表页预览 / 复制。
 * 不是给主视图用的（主视图应该渲染可折叠的树）。
 */
export function stringifyValue(node: SerializedValue, maxLength = 200): string {
  const one = (n: SerializedValue, depth: number): string => {
    switch (n.t) {
      case 'undef':
        return 'undefined'
      case 'null':
        return 'null'
      case 'bool':
        return String(n.v)
      case 'num':
        return `${n.v}`
      case 'bigint':
        return `${n.v}n`
      case 'str':
        return `${JSON.stringify(n.v)}${n.len !== undefined ? `…(${n.len}字符)` : ''}`
      case 'sym':
        return n.v
      case 'fn':
        return `[Function${n.name ? ` ${n.name}` : ''}]`
      case 'date':
        return `Date(${n.v})`
      case 'regexp':
        return n.v
      case 'err':
        return `${n.name}: ${n.message}`
      case 'weak':
        return n.ctor
      case 'promise':
        return 'Promise'
      case 'bin':
        return `${n.ctor}(${n.byteLength})`
      case 'cut':
        return `[截断: ${n.v}]`
      case 'ref':
        return `→#${n.v}${n.circ ? ' (循环)' : ''}`
      default: {
        if (depth > 2) return '…'
        if (n.t === 'arr') return `Array(${n.v.length + (n.more ?? 0)})`
        if (n.t === 'set') return `Set(${n.v.length + (n.more ?? 0)})`
        if (n.t === 'map') return `Map(${n.v.length + (n.more ?? 0)})`
        const keys = Object.keys(n.v)
        return `${n.ctor ?? 'Object'} { ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ' …' : ''} }`
      }
    }
  }

  const text = one(node, 0)
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}
