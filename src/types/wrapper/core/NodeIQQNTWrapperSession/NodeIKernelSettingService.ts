interface SettingListener {
  /**
   * 当隐私设置发生变化时调用的回调函数
   */
  onPrivacySettingChanged: () => void

  /**
   * 当验证信息发生变化时调用的回调函数
   */
  onVerifyInfoChange: () => void

  /**
   * 当数值类型的设置发生变化时调用的回调函数
   */
  onNumSettingChanged: () => void

  /**
   * 当字符串类型的设置发生变化时调用的回调函数
   */
  onStrSettingChanged: () => void

  /**
   * 当缓冲区类型的设置发生变化时调用的回调函数
   */
  onBufferSettingChanged: () => void

  /**
   * 当清理缓存进度发生变化时调用的回调函数
   */
  onCleanCacheProgressChanged: () => void
}

export interface NodeIKernelSettingService {
  /** 添加内核设置监听器 */
  addKernelSettingListener: (listener: SettingListener) => void

  /** 移除内核设置监听器 */
  removeKernelSettingListener: (listener: SettingListener) => void

  /** 设置隐私设置 */
  setPrivacySetting: (setting: any) => Promise<void>

  /** 获取隐私设置 */
  getPrivacySetting: () => Promise<any>

  /** 根据数字类型获取设置 */
  getSettingForNum: (key: string) => Promise<number>

  /** 根据字符串类型获取设置 */
  getSettingForStr: (p1: unknown[]) => WrapperAsyncResponse

  /** 根据缓冲区获取设置 */
  getSettingForBuffer: (key: string) => Promise<Uint8Array>

  /** 根据数字类型设置设置 */
  setSettingForNum: (key: string, value: number) => Promise<void>

  /** 根据字符串类型设置设置 */
  setSettingForStr: (key: string, value: string) => Promise<void>

  /** 根据缓冲区设置设置 */
  setSettingForBuffer: (key: string, value: Uint8Array) => Promise<void>

  /** 验证新账号 */
  verifyNewAccount: (accountData: any) => Promise<boolean>

  /** 修改账号 */
  modifyAccount: (accountId: string, newData: any) => Promise<void>

  /** 销毁账号 */
  destroyAccount: (accountId: string) => Promise<void>

  /** 扫描缓存 */
  scanCache: () => Promise<any>

  /** 清除缓存 */
  clearCache: () => Promise<void>

  /** 获取需要确认的开关状态 */
  getNeedConfirmSwitch: () => Promise<boolean>

  /** 设置需要确认的开关状态 */
  setNeedConfirmSwitch: (needConfirm: boolean) => Promise<void>

  /** 获取自启动开关状态 */
  getSelfStartSwitch: () => Promise<boolean>

  /** 设置自启动开关状态 */
  setSelfStartSwitch: (selfStart: boolean) => Promise<void>

  /** 获取自动登录开关状态 */
  getAutoLoginSwitch: () => Promise<boolean>

  /** 设置自动登录开关状态 */
  setAutoLoginSwitch: (autoLogin: boolean) => Promise<void>

  /** 获取 QQ 浏览器开关状态 */
  getQQBrowserSwitchFromQldQQ: () => Promise<boolean>

  /** 检查 QQ 浏览器是否安装 */
  isQQBrowserInstall: () => Promise<boolean>

  /** 使用 QQ 浏览器打开 URL */
  openUrlWithQQBrowser: (url: string) => Promise<void>

  openUrlInIM: (url: string) => undefined
}
