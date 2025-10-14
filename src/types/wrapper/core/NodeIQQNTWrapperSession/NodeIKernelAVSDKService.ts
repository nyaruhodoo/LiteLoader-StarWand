interface AVSDKListener {
  /**
   * 当有操作发给 AVSDK 时调用的回调函数
   */
  onActionToAVSDK: () => void

  /**
   * 当有邀请操作发给 AVSDK 时调用的回调函数
   */
  OnInviteActionToAVSDK: () => void

  /**
   * 当接收到 S2C 操作发给 AVSDK 时调用的回调函数
   */
  onS2CActionToAVSDK: () => void

  /**
   * 当群视频操作发给 AVSDK 时调用的回调函数
   */
  OnGroupVideoActionToAVSDK: () => void

  /**
   * 当群视频服务器推送给 AVSDK 时调用的回调函数
   */
  OnGroupVideoServerPushToAVSDK: () => void

  /**
   * 当群视频成员数量推送信息到 AVSDK 时调用的回调函数
   */
  OnGroupVideoMemNumPushInfo: () => void

  /**
   * 当群音频成员数量发生变化时调用的回调函数
   */
  onGroupAudioMemNumChange: () => void

  /**
   * 当群视频邀请成员更新时调用的回调函数
   */
  onGroupVideoInviteMemberUpdate: () => void

  /**
   * 当接收到群视频 JSON 缓冲响应时调用的回调函数
   */
  onRecvGroupVideoJsonBufferRsp: () => void
}

export interface NodeIKernelAVSDKService {
  /**
   * 注册一个监听器，用于接收 AVSDK 相关的事件通知。
   * @param listener - 事件监听器函数
   */
  addKernelAVSDKListener: (listener: AVSDKListener) => void

  /**
   * 移除已注册的 AVSDK 事件监听器。
   * @param listener - 要移除的事件监听器函数
   */
  removeKernelAVSDKListener: (listener: AVSDKListener) => void

  /**
   * 设置来自 AVSDK 的某个动作，可能用于执行特定的操作。
   * @param action - 要设置的动作
   */
  setActionFromAVSDK: (action: string) => void

  /**
   * 允许或禁止相册通知，可能与视频相关的功能有关。
   * @param allowed - 是否允许相册通知
   */
  allowAlbumNotify: (allowed: boolean) => void

  /**
   * 发送一个 JSON 格式的视频缓冲区，通常用于处理视频流或数据传输。
   * @param jsonBuffer - 要发送的视频 JSON 缓冲区
   */
  sendGroupVideoJsonBuffer: (jsonBuffer: string) => void

  /**
   * 启动来自 AVSDK 的群组视频命令请求。
   * @param params - 启动请求的参数
   */
  startGroupVideoCmdRequestFromAVSDK: (params: any) => void

  /**
   * 检查依赖项是否满足，返回一个布尔值，表示依赖项是否正确配置。
   * @returns - 如果依赖项满足，返回 true；否则返回 false。
   */
  checkDependencies: () => boolean
}
