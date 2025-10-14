interface QiDianListener {
  /**
   * 当接收到侧边栏配置通知时调用的回调函数
   */
  onSideBarConfigNotify: () => void
}

export interface NodeIKernelQiDianService {
  /**
   * 注册一个企点服务的监听器，当企点服务的状态或数据发生变化时触发。
   * @param listener - 当企点服务状态改变时调用的回调函数。
   */
  addKernelQiDianListener: (listener: QiDianListener) => void

  /**
   * 移除已注册的企点服务监听器。
   * @param listener - 需要移除的监听器回调函数。
   */
  removeKernelQiDianListener: (listener: QiDianListener) => void

  /**
   * 请求 WPA（Web Platform API）的签名信息。
   * @returns 签名信息。
   */
  requestWpaSigT: () => string

  /**
   * 请求根据 UIN（User Identification Number）获取企点用户的唯一标识 UID。
   * @param uin - 用户的 UIN。
   * @returns 对应的企点 UID。
   */
  requestQidianUidFromUin: (uin: string) => string

  /**
   * 请求用于远程控制的扩展 UIN。
   * @returns 扩展 UIN，用于远程控制。
   */
  requestExtUinForRemoteControl: () => string

  /**
   * 请求用于远程控制的主 UIN。
   * @returns 主 UIN，用于远程控制。
   */
  requestMainUinForRemoteControl: () => string

  /**
   * 请求导航配置数据。
   * @returns 导航配置信息。
   */
  requestNaviConfig: () => any

  /**
   * 请求获取 WPA 平台的企业信息。
   * @returns 企业的相关信息。
   */
  requestWpaCorpInfo: () => any

  /**
   * 请求获取 WPA 平台的用户信息。
   * @returns 用户的相关信息。
   */
  requestWpaUserInfo: () => any
}
