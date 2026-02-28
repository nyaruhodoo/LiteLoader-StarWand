// global.d.ts
declare namespace RendererEvents {
  const onLogin: (callback: (uid?: string) => void) => void
  const onSettingsWindowCreated: (callback: () => void) => void
  const onSettingsWindowCreatedOnce: (callback: () => void) => void
  const onMessageWindowCreated: (callback: () => void) => void
  const onMessageWindowCreatedOnce: (callback: () => void) => void
}

interface IQwQNTPlugin {
  name: string
  qwqnt?: {
    name?: string
    icon?: string
    inject?: {
      main?: string
      renderer?: string
      preload?: string
    }
  }
};

declare namespace PluginSettings {
  interface ICommon {
    readConfig: <T>(id: string, defaultConfig?: T) => T
    writeConfig: <T>(id: string, newConfig: T) => boolean
    openPath: (path: string) => void
    openExternal: (url: string) => void
  }
  interface IRenderer extends ICommon {
    registerPluginSettings: (packageJson: IQwQNTPlugin) => Promise<HTMLDivElement>
  }

  const main: ICommon
  const preload: ICommon
  const renderer: IRenderer
}
