import packageJson from '@package'

/**
 * 插件 id，等价于 package.json 的 name。
 *
 * 用于配置存储键、IPC 频道前缀、window 上的 contextBridge 键、BroadcastChannel 名称，
 * 必须与框架注册插件时使用的包名完全一致。
 */
export const pluginId: string = packageJson.name

/**
 * 面向用户的展示名称（系统通知标题等）。
 *
 * package.json 没有对应的展示名字段（原先取自 manifest.json 的 name），故在此维护。
 */
export const pluginDisplayName = '星之杖'
