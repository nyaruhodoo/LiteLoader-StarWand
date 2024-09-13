declare namespace LiteLoader {
  const path: ILiteLoaderPath
  const versions: ILiteLoaderVersion
  const os: ILiteLoaderOS
  const package: ILiteLoaderPackage
  const config: {
    LiteLoader: {
      disabled_plugins: string[]
    }
  }
  const plugins: Record<string, ILiteLoaderPlugin>
  const api: ILiteLoaderAPI

  interface ILiteLoaderPath {
    root: string
    profile: string
    data: string
    plugins: string
  }

  interface ILiteLoaderVersion {
    qqnt: string
    liteloader: string
    node: string
    chrome: string
    electron: string
  }

  interface ILiteLoaderOS {
    platform: 'win32' | 'linux' | 'darwin'
  }

  interface ILiteLoaderPackage {
    liteloader: object
    qqnt: object
  }

  interface ILiteLoaderPlugin {
    manifest: object
    incompatible: boolean
    disabled: boolean
    path: ILiteLoaderPluginPath
  }

  interface ILiteLoaderPluginPath {
    plugin: string
    data: string
    injects: ILiteLoaderPluginPathInject
  }

  interface ILiteLoaderPluginPathInject {
    main: string
    renderer: string
    preload: string
  }

  interface ILiteLoaderAPI {
    openPath: (path: string) => void
    openExternal: (url: string) => void
    config: ILiteLoaderAPIConfig
    plugin: {
      install: () => void
      delete: () => void
      disable: () => void
    }
  }

  interface ILiteLoaderAPIConfig {
    set: <IConfig = unknown>(slug: string, new_config: IConfig) => Promise<IConfig>
    get: <IConfig = unknown>(slug: string, defaultConfig: IConfig) => Promise<IConfig>
  }
}

declare module Electron {
  namespace CrossProcessExports {
    interface BrowserWindow {
      webContents: WebContents & {
        _events: Record<string, () => void>
      }
    }
  }
}
