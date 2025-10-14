interface OnlineStatusListener {
  /**
   * 当接收到在线状态点赞推送时调用的回调函数
   */
  onRecvOnlineStatusPraisePush: () => void

  /**
   * 当获取聚合后接收点赞状态结果时调用的回调函数
   */
  onRecvLikeStatusResultAfterGetAggregation: () => void
}

export interface NodeIKernelOnlineStatusService {
  /**
   * 设置用户的点赞状态。
   * @param status - 一个布尔值，表示是否点赞。
   */
  setLikeStatus: (status: boolean) => void

  /**
   * 检查当前的点赞状态。
   * @returns 一个布尔值，表示当前是否已点赞。
   */
  checkLikeStatus: () => boolean

  /**
   * 获取点赞列表。
   * @returns 包含已点赞用户或内容的列表。
   */
  getLikeList: () => any[]

  /**
   * 设置已读的点赞列表状态。
   */
  setReadLikeList: () => void

  /**
   * 获取聚合群组模型。
   * @returns 聚合群组模型数据的列表。
   */
  getAggregationGroupModels: () => any[]

  /**
   * 标记用户已点击聚合页面入口。
   */
  didClickAggregationPageEntrance: () => void

  /**
   * 获取聚合页面入口数据。
   * @returns 聚合页面入口的相关信息。
   */
  getAggregationPageEntrance: () => any

  /**
   * 检查是否应显示AIO状态动画。
   * @returns 一个布尔值，指示是否应显示AIO状态动画。
   */
  getShouldShowAIOStatusAnimation: () => boolean

  /**
   * 注册一个在线状态监听器，当在线状态发生变化时触发。
   * @param listener - 当在线状态改变时调用的回调函数。
   */
  addKernelOnlineStatusListener: (listener: OnlineStatusListener) => void

  /**
   * 移除已注册的在线状态监听器。
   * @param listener - 需要移除的监听器回调函数。
   */
  removeKernelOnlineStatusListener: (listener: OnlineStatusListener) => void

  /**
   * 设置在线状态的轻量级业务开关。
   * @param enabled - 布尔值，指示是否启用轻量级在线状态业务。
   */
  setOnlineStatusLiteBusinessSwitch: (enabled: boolean) => void
}
