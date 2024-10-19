import type { ConfigType } from '@/defaultConfig'
import { defaultConfig } from '@/defaultConfig'
import manifest from '@/manifest'

export class Utils {
  /**
   * 初始化插件配置
   */
  static async getConfig() {
    const oldConfig = await LiteLoader.api.config.get<ConfigType>(manifest.slug, defaultConfig)
    const newConfig = this.mergeConfig(oldConfig, defaultConfig)
    return newConfig
  }

  /**
   * 更新插件配置
   */
  static async updateConfig(config: ConfigType) {
    await LiteLoader.api.config.set(manifest.slug, config)
    this.log('Config已更新', JSON.stringify(config))
  }

  /**
   * 合并配置项
   */
  static mergeConfig(oldConfig: Record<string, any>, newConfig: ConfigType) {
    const targetObj = structuredClone(newConfig)

    for (const [key, value] of Object.entries(oldConfig)) {
      // 废弃的属性
      if (!Object.hasOwn(targetObj, key)) continue
      // 类型已更新
      if (Object.prototype.toString.call(value) !== Object.prototype.toString.call(targetObj[key])) continue
      // 合并数组
      if (Array.isArray(value)) {
        targetObj[key] = [...new Set([...value, ...targetObj[key]])]
        continue
      }
      // 处理对象类型，进行深层合并
      if (typeof value === 'object' && value) {
        targetObj[key] = this.mergeConfig(value, targetObj[key])
        continue
      }
      // 基本值以本地配置为准
      targetObj[key] = value
    }

    return targetObj
  }

  /**
   * 带有插件标识的Log
   */
  static log(...args) {
    console.log(`${manifest.slug}:`, ...args)
  }

  /**
   * 生成随机整数
   */
  static randomInteger(min: number, max: number) {
    const rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand)
  }

  /**
   * 返回一个指定时间后决议为 resolve 的 promise
   */
  static wait(millisecond: number) {
    if (millisecond <= 0) return
    return new Promise((resolve) => setTimeout(resolve, millisecond))
  }

  /**
   * 为对象创建深层Proxy
   */
  static createDeepProxy<T extends Record<string, any>>(obj: T, handler: ProxyHandler<T>): T {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key]) {
        obj[key] = Utils.createDeepProxy(obj[key], handler)
      }
    }

    return new Proxy<T>(obj, handler)
  }

  /**
   * 根据path从对象中取值
   */
  static getProperty(obj: Record<string, any>, path: string): any {
    let target = obj
    const keys = path.split('.')

    while (keys.length) {
      const key = keys.shift()
      if (!key) return
      target = target[key]
    }
    return target
  }

  /**
   * 根据path修改对象属性值
   */
  static setProperty(obj: Record<string, any>, path: string, val: any) {
    let target = obj
    const keys = path.split('.')

    const lastKey = keys.pop()

    if (!lastKey) return

    while (keys.length) {
      const key = keys.shift()
      if (!key) return
      target = target[key]
    }
    return (target[lastKey] = val)
  }
}
