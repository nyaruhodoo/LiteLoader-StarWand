interface WiFiPhotoClientListener {
  /**
   * 当对等请求访问相册时调用的回调函数
   */
  onPeerRequestVisitAlbum: () => void

  /**
   * 请求结果的回调函数
   */
  onRequestResult: () => void

  /**
   * 连接成功的回调函数
   */
  onConnected: () => void

  /**
   * 重新连接的回调函数
   */
  onReconnecting: () => void

  /**
   * 断开连接时的回调函数
   */
  onDisconnection: () => void

  /**
   * 文件下载数量更新的回调函数
   */
  onDownloadFileCountUpdate: () => void

  /**
   * 下载任务完成的回调函数
   */
  onDownloadTaskComplete: () => void

  /**
   * 下载速度更新的回调函数
   */
  onDownloadSpeedUpdate: () => void

  /**
   * 缩略图下载完成的回调函数
   */
  onThumbDownloadComplete: () => void

  /**
   * 文件下载进度的回调函数
   */
  onFileDownloadProgress: () => void

  /**
   * 文件下载完成的回调函数
   */
  onFileDownloadComplete: () => void

  /**
   * 超时取消的回调函数
   */
  onTimeoutCanceled: () => void
}

export interface NodeIKernelWiFiPhotoClientService {
  /**
   * 添加 WiFi 照片客户端的监听器，用于监听服务的状态或事件变化。
   * @param listener - 当 WiFi 照片客户端状态变化时调用的回调函数。
   */
  addKernelWiFiPhotoClientListener: (listener: WiFiPhotoClientListener) => void

  /**
   * 移除已经注册的 WiFi 照片客户端监听器。
   * @param listener - 需要移除的监听器回调函数。
   */
  removeKernelWiFiPhotoClientListener: (listener: WiFiPhotoClientListener) => void

  /**
   * 测试与主机的连接是否成功。
   * @param host - 目标主机地址。
   * @returns 是否成功连接。
   */
  connectToHostForTest: (host: string) => boolean

  /**
   * 请求访问主机的相册。
   * @returns 是否成功请求访问相册。
   */
  requestVisitAlbum: () => boolean

  /**
   * 取消当前的相册访问请求。
   */
  cancelRequest: () => void

  /**
   * 请求对相册的完全访问权限。
   * @returns 是否成功请求完全访问。
   */
  requestAlbumFullAccess: () => boolean

  /**
   * 断开与 WiFi 照片客户端的连接。
   */
  disconnect: () => void

  /**
   * 获取对等设备的网络状态。
   * @returns 对等设备的网络状态信息。
   */
  getPeerNetworkStatus: () => any

  /**
   * 查询未完成的下载记录。
   * @returns 未完成的下载记录列表。
   */
  queryUncompleteDownloadRecords: () => any[]

  /**
   * 恢复未完成的下载记录。
   * @returns 是否成功恢复下载。
   */
  resumeUncompleteDownloadRecords: () => boolean

  /**
   * 清除未完成的下载记录。
   */
  clearUncompleteDownloadRecords: () => void

  /**
   * 获取相册列表。
   * @returns 相册列表信息。
   */
  getAlbumList: () => any[]

  /**
   * 获取相册文件的保存路径。
   * @returns 保存路径字符串。
   */
  getAlbumFileSavePath: () => string

  /**
   * 获取首屏预览的简要照片信息。
   * @returns 首屏照片简要信息。
   */
  getPhotoSimpleInfoForFirstView: () => any[]

  /**
   * 获取所有照片的简要信息。
   * @returns 所有照片的简要信息列表。
   */
  getAllPhotoSimpleInfo: () => any[]

  /**
   * 批量获取照片详细信息。
   * @param photoIds - 需要获取详细信息的照片 ID 列表。
   * @returns 照片详细信息列表。
   */
  getPhotoInfoBatch: (photoIds: string[]) => any[]

  /**
   * 根据配置批量获取照片缩略图。
   * @param config - 缩略图获取配置。
   * @returns 缩略图列表。
   */
  getPhotoThumbBatchWithConfig: (config: any) => any[]

  /**
   * 取消获取照片缩略图的批量请求。
   */
  cancelGetPhotoThumbBatch: () => void

  /**
   * 批量获取照片的原始图像数据。
   * @param photoIds - 需要获取的照片 ID 列表。
   * @returns 照片原始数据列表。
   */
  getPhotoBatch: (photoIds: string[]) => any[]

  /**
   * 取消获取照片的请求。
   */
  cancelGetPhoto: () => void

  /**
   * 取消所有进行中的照片请求。
   */
  cancelAll: () => void

  /**
   * 获取指定照片并将其保存到指定路径。
   * @param photoId - 要获取的照片 ID。
   * @param savePath - 保存路径。
   * @returns 是否成功获取并保存照片。
   */
  getPhotoAndSaveAs: (photoId: string, savePath: string) => boolean

  /**
   * 批量删除指定照片。
   * @param photoIds - 要删除的照片 ID 列表。
   * @returns 是否成功删除照片。
   */
  deletePhotoBatch: (photoIds: string[]) => boolean

  /**
   * 进行 WiFi 照片服务的预检查，以确保连接和数据传输的条件已满足。
   * @returns 预检查结果。
   */
  wifiPhotoPreCheck: () => any

  /**
   * 获取 WiFi 下载文件信息。
   * @returns 下载文件的信息列表。
   */
  getWiFiPhotoDownFileInfos: () => any[]
}
