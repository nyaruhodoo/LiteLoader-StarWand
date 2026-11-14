import { pluginId } from '@/pluginMeta'

export class Utils {
  static watchURLHash(callback: (hash: string) => unknown) {
    navigation.addEventListener(
      'navigatesuccess',
      () => {
        callback(location.hash)
      },
      { once: true },
    )
  }

  static createStorageUrl(url: string) {
    const pluginsPath = qwqnt.framework.plugins[pluginId]?.meta.path
    if (!pluginsPath) throw new Error(`请确认插件命名是否正确: ${pluginId}`)
    return `storage://plugins/${pluginsPath.match(/[\\/]([^\\/]+)$/)?.[1]}${url}`
  }
}
