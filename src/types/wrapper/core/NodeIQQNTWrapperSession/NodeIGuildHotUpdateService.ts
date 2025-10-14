interface HotUpdateListener {
  /**
   * 当收到热更新推送时调用的回调函数
   */
  onHotUpdatePush: () => void
}

export interface NodeIGuildHotUpdateService {
  /**
   * 添加热更新监听器
   * @param listener - 热更新监听器对象
   */
  addHotUpdateListener: (listener: HotUpdateListener) => void

  /**
   * 移除热更新监听器
   * @param listener - 热更新监听器对象
   */
  removeHotUpdateListener: (listener: HotUpdateListener) => void
}
