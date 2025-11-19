import { slug } from '@/manifest'

export class Utils {
  static watchURLHash(callback: (hash: string) => unknown) {
    // @ts-expect-error  忽略错误
    navigation.addEventListener('navigatesuccess', () => {
      callback(location.hash)
    }, { once: true })
  }

  static createStorageUrl(url: string) {
    const pluginsPath = qwqnt.framework.plugins[slug]?.meta.path
    if (!pluginsPath)
      throw new Error(`请确认插件命名是否正确: ${slug}`)
    return `storage://plugins/${pluginsPath.match(/[\\/]([^\\/]+)$/)?.[1]}${url}`
  }
}
