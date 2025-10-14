export interface NodeIKernelTipOffService {
  /**
   * 注册一个监听器，用于接收举报相关的事件通知。
   * @param listener - 事件监听器函数
   */
  addKernelTipOffListener: (listener: () => void) => void

  /**
   * 移除已注册的举报事件监听器。
   * @param listener - 要移除的事件监听器函数
   */
  removeKernelTipOffListener: (listener: () => void) => void

  /**
   * 举报消息。
   * @param message - 要举报的消息对象
   */
  tipOffMsgs: (message: any) => void

  /**
   * 对 UIN 进行 AES 加密信息处理。
   * @param uin - 用户的唯一标识符
   * @returns - 返回加密后的信息
   */
  encodeUinAesInfo: (uin: string) => string

  /**
   * 获取 pskey，用于验证。
   * @returns - 返回 pskey 的字符串
   */
  getPskey: (
    p1: string[],
    p2: boolean
  ) => WrapperAsyncResponse<{
    domainPskeyMap: Map<string, string>
  }>

  /**
   * 发送举报的 JavaScript 数据。
   * @param data - 要发送的数据对象
   */
  tipOffSendJsData: (data: any) => void
}
