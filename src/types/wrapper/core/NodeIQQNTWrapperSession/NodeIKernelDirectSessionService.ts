interface DirectSessionListener {
  /**
   * 当直接会话列表发生变化时调用的回调函数
   */
  onDirectSessionListChanged: () => void

  /**
   * 设置直接会话黑名单状态时调用的回调函数
   */
  onSetDirectSessionBlackStatus: () => void

  /**
   * 创建直接会话时调用的回调函数
   */
  onCreateDirectSession: () => void

  /**
   * 直接会话切换状态变化时调用的回调函数
   */
  onDirectSwitchStatus: () => void
}

export interface NodeIKernelDirectSessionService {
  /**
   * 添加一个直接会话监听器
   * @param listener - 监听器对象
   */
  addKernelDirectSessionListener: (listener: DirectSessionListener) => void

  /**
   * 移除一个直接会话监听器
   * @param listener - 监听器对象
   */
  removeKernelDirectSessionListener: (listener: DirectSessionListener) => void

  /**
   * 获取直接会话列表
   * @returns - 返回直接会话的列表
   */
  getDirectSessionList: () => any[]

  /**
   * 移除直接会话
   * @param sessionId - 要移除的会话ID
   * @returns - 操作结果
   */
  removeDirectSession: (sessionId: string) => any

  /**
   * 获取直接会话的开关状态
   * @returns - 返回开关状态
   */
  getDirectSwitchStatus: () => boolean

  /**
   * 拉取直接会话列表
   * @returns - 异步操作结果，包含直接会话列表
   */
  fetchDirectSessionList: () => Promise<any[]>
}
