interface QQPlayListener {
  /**
   * 当收到 Mojo 回调时调用的回调函数
   */
  onMojoCallback: () => void
}

export interface NodeIKernelQQPlayService {
  /**
   * 初始化 QQPlay 服务。
   */
  init: () => void

  /**
   * 卸载并清理 QQPlay 服务。
   */
  uninit: () => void

  /**
   * 创建桌面快捷方式。
   * @param shortcutName - 快捷方式的名称。
   * @param targetPath - 快捷方式的目标路径。
   * @returns 是否成功创建快捷方式。
   */
  createLnkShortcut: (shortcutName: string, targetPath: string) => boolean

  /**
   * 将指定窗口置于前台。
   * @param windowId - 窗口的唯一标识。
   */
  setForegroundWindow: (windowId: string) => void

  /**
   * 获取桌面路径。
   * @returns 系统桌面路径的字符串。
   */
  getDesktopPath: () => string

  /**
   * 获取模拟器进程的运行状态。
   * @returns 一个布尔值，指示模拟器是否正在运行。
   */
  getSimulatorProcStatus: () => boolean

  /**
   * 从系统注册表中获取指定键的值。
   * @param keyPath - 注册表键的路径。
   * @param valueName - 注册表值的名称。
   * @returns 注册表值的内容。
   */
  getSystemRegValue: (keyPath: string, valueName: string) => string | null

  /**
   * 启动模拟器进程。
   * @returns 是否成功启动模拟器。
   */
  startSimulator: () => boolean

  /**
   * 注册一个 QQPlay 服务的监听器，当 QQPlay 服务的状态或数据发生变化时触发。
   * @param listener - 当 QQPlay 服务状态改变时调用的回调函数。
   */
  addKernelQQPlayListener: (listener: QQPlayListener) => void

  /**
   * 向模拟器发送消息。
   * @param message - 要发送的消息内容。
   * @returns 是否成功发送消息。
   */
  sendMsg2Simulator: (message: string) => boolean

  /**
   * 设置系统注册表中的指定键值。
   * @param keyPath - 注册表键的路径。
   * @param valueName - 注册表值的名称。
   * @param value - 要设置的值内容。
   * @returns 是否成功设置注册表值。
   */
  setSystemRegValue: (keyPath: string, valueName: string, value: string) => boolean
}
