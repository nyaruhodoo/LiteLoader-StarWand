interface RemotingListener {
  /**
   * 当缓冲穿透时调用的回调函数
   */
  onPenetrateBuffer: () => void

  /**
   * 当接收到控制请求时调用的回调函数
   */
  onReceiveControlRequest: () => void

  /**
   * 当接收到控制邀请时调用的回调函数
   */
  onReceiveControlInvite: () => void

  /**
   * 当对等方接受请求时调用的回调函数
   */
  onPeerAccept: () => void

  /**
   * 当连接建立时调用的回调函数
   */
  onConnected: () => void

  /**
   * 当连接断开时调用的回调函数
   */
  onDisConnected: () => void
}

export interface NodeIKernelRemotingService {
  /**
   * 注册一个监听器，用于监听远程服务的状态或数据变化。
   * @param listener - 当远程服务状态改变时调用的回调函数。
   */
  addKernelRemotingListener: (listener: RemotingListener) => void

  /**
   * 移除已经注册的远程服务监听器。
   * @param listener - 需要移除的监听器回调函数。
   */
  removeKernelRemotingListener: (listener: RemotingListener) => void

  /**
   * 设置穿透缓冲区，用于传递远程连接所需的特殊数据。
   * @param buffer - 穿透数据缓冲区。
   */
  // eslint-disable-next-line node/prefer-global/buffer
  setPenetrateBuffer: (buffer: Buffer) => void

  /**
   * 启动远程客户端，以便进行远程连接。
   * @returns 是否成功启动远程客户端。
   */
  startRemotingClient: () => boolean

  /**
   * 发起远程邀请请求。
   * @param inviteInfo - 包含邀请连接信息的数据。
   * @returns 是否成功发起邀请。
   */
  startRemotingInvite: (inviteInfo: any) => boolean

  /**
   * 停止当前的远程服务或连接。
   * @returns 是否成功停止服务。
   */
  stopRemoting: () => boolean

  /**
   * 接受远程连接请求。
   * @returns 是否成功接受请求。
   */
  accept: () => boolean
}
