interface MsgBackupListener {
  /**
   * 当收到消息备份请求时调用的回调函数
   */
  onGetRequestMsgBackup: () => void

  /**
   * 当收到消息恢复请求时调用的回调函数
   */
  onGetRequestMsgRestore: () => void

  /**
   * 当状态改变时调用的回调函数
   */
  onStateChange: () => void

  /**
   * 当接收到聊天记录数量时调用的回调函数
   */
  onRecvChatCount: () => void

  /**
   * 当接收到二维码时调用的回调函数
   */
  onRecvQRCode: () => void

  /**
   * 当聊天记录恢复完成时调用的回调函数
   */
  onChatRestoreFinish: () => void

  /**
   * 当聊天记录备份完成时调用的回调函数
   */
  onChatBackupFinish: () => void

  /**
   * 当聊天记录迁移下载完成时调用的回调函数
   */
  onChatMigrateDownloadFinish: () => void

  /**
   * 当聊天记录迁移导入完成时调用的回调函数
   */
  onChatMigrateImportFinish: () => void

  /**
   * 当聊天记录迁移完成时调用的回调函数
   */
  onChatMigrateFinish: () => void

  /**
   * 当传输速度更新时调用的回调函数
   */
  onTransferSpeed: () => void

  /**
   * 当连接断开时调用的回调函数
   */
  onDisconnection: () => void
}

export interface NodeIKernelMsgBackupService {
  /**
   * 注册一个消息备份监听器，当备份状态发生变化时触发。
   * @param listener - 当备份状态改变时调用的回调函数。
   */
  addKernelMsgBackupListener: (listener: MsgBackupListener) => void

  /**
   * 移除已注册的消息备份监听器。
   * @param listener - 需要移除的监听器回调函数。
   */
  removeKernelMsgBackupListener: (listener: MsgBackupListener) => void

  /**
   * 获取当前消息备份的存储位置。
   * @returns 当前备份的存储位置路径。
   */
  getMsgBackupLocation: () => string

  /**
   * 设置消息备份的存储位置。
   * @param location - 新的备份存储位置路径。
   */
  setMsgBackupLocation: (location: string) => void

  /**
   * 请求执行消息备份操作。
   */
  requestMsgBackup: () => void

  /**
   * 请求执行消息恢复操作。
   */
  requestMsgRestore: () => void

  /**
   * 请求消息迁移操作，将备份从一个设备迁移到另一个设备。
   */
  requestMsgMigrate: () => void

  /**
   * 获取本地存储的备份数据。
   * @returns 本地备份数据的相关信息或内容。
   */
  getLocalStorageBackup: () => any

  /**
   * 删除本地备份数据。
   */
  deleteLocalBackup: () => void

  /**
   * 清除缓存数据。
   */
  clearCache: () => void

  /**
   * 启动备份服务。
   */
  start: () => void

  /**
   * 停止备份服务。
   */
  stop: () => void

  /**
   * 暂停备份服务。
   */
  pause: () => void

  /**
   * 设置消息备份数据处理选项。
   * @param option - 备份数据处理选项。
   */
  setMsgBackupDataHandlingOption: (option: any) => void
}
