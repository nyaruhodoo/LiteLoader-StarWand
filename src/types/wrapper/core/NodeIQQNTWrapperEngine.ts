export interface NodeIQQNTWrapperEngine {
  onSendSSOReply: () => void
  getECDHService: () => any
  initWithDeskTopConfig: (
    config: {
      base_path_prefix: string
      platform_type: number
      app_type: number
      app_version: string
      os_version: string
      use_xlog: boolean
      qua: string
      global_path_config: {
        desktopGlobalPath: string
      }
      thumb_config: {
        maxSide: number
        minSide: number
        longLimit: number
        density: number
      }
    },
    callback: {
      onLog: () => void
      onGetSrvCalTime: () => void
      onShowErrUITips: () => void
      fixPicImgType: () => Promise<void>
      getAppSetting: () => void
      onInstallFinished: () => Promise<void>
      onUpdateGeneralFlag: () => void
      onGetOfflineMsg: () => void
    }
  ) => boolean
  readyToShow: () => void
  initWithMobileConfig: (config: any) => void
  ClearMoblieQQAccountData: () => void
  destroy: () => void
  setLogLevel: (level: number) => void
  getDeviceInfo: () => any
  initLog: () => void
}
