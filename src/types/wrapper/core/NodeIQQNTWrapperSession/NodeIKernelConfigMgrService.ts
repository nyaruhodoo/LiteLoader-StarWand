interface ConfigMgrServiceEventCallbacks {
  onSideBarChanged: (params: unknown) => void
}

export interface NodeIKernelConfigMgrService {
  /**
   * 注册一个监听器，用于接收配置管理相关的事件通知。
   * @param listener - 事件监听器函数
   */
  addKernelConfigMgrListener: (listener: ConfigMgrServiceEventCallbacks) => void

  /**
   * 移除已注册的配置管理事件监听器。
   * @param listener - 要移除的事件监听器函数
   */
  removeKernelConfigMgrListener: (listener: ConfigMgrServiceEventCallbacks) => void

  /**
   * 获取当前的配置管理信息。
   * @returns - 返回配置管理的信息对象
   */
  getConfigMgrInfo: () => any

  /**
   * 获取语音频道的最大人数。
   * @returns - 最大人数的整数值
   */
  getVoiceChannelMaxPeopleCount: () => number

  /**
   * 获取配置管理信息的任务 ID。
   * @returns - 任务 ID 的字符串
   */
  getConfigMgrInfoTaskId: () => string

  /**
   * 更新配置管理信息的任务 ID。
   * @param taskId - 新的任务 ID
   */
  updateConfigMgrInfoTaskId: (taskId: string) => void

  /**
   * 保存侧边栏的配置。
   * @param config - 要保存的侧边栏配置对象
   */
  saveSideBarConfig: (config: any) => void

  /**
   * 加载侧边栏的配置。
   * @returns - 返回加载的侧边栏配置对象
   */
  loadSideBarConfig: () => any
}
