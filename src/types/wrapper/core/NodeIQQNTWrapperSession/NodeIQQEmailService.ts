interface QQEmailServiceEventCallbacks {
  onNewMailInfo: (params: string) => void
}

export interface NodeIQQEmailService {
  /**
   * 注册一个监听器，用于接收共享相关的事件通知。
   * @param listener - 事件监听器函数
   */
  addKernelShareListener: (listener: QQEmailServiceEventCallbacks) => void

  /**
   * 移除已注册的共享事件监听器。
   * @param listener - 要移除的事件监听器函数
   */
  removeKernelShareListener: (listener: QQEmailServiceEventCallbacks) => void

  /**
   * 获取指定电子邮件的信息。
   * @param emailId - 电子邮件的唯一标识符
   * @returns - 返回电子邮件信息的对象
   */
  getEmailInfo: (emailId: string) => any

  /**
   * 删除指定的电子邮件。
   * @param emailId - 要删除的电子邮件的唯一标识符
   */
  deleteEmail: (emailId: string) => void

  /**
   * 标记电子邮件为已通知状态，通常用于更新用户界面或状态。
   * @param emailId - 要标记的电子邮件的唯一标识符
   */
  markEmailNotified: (emailId: string) => void
}
