interface StorageCleanListener {
  /**
   * 当缓存清理进度发生变化时调用的回调函数
   */
  onCleanCacheProgressChanged: () => void

  /**
   * 当缓存扫描进度发生变化时调用的回调函数
   */
  onScanCacheProgressChanged: () => void

  /**
   * 当缓存存储状态变化时调用的回调函数
   */
  onCleanCacheStorageChanged: () => void

  /**
   * 当扫描完成时调用的回调函数
   */
  onFinishScan: () => void

  /**
   * 当聊天记录清理完成时调用的回调函数
   */
  onChatCleanDone: () => void
}

export interface NodeIKernelStorageCleanService {
  /**
   * 注册一个监听器，用于监听存储清理服务的状态或事件变化。
   * @param listener - 当存储清理服务状态变化时调用的回调函数。
   */
  addKernelStorageCleanListener: (listener: StorageCleanListener) => void

  /**
   * 移除已经注册的存储清理服务监听器。
   * @param listener - 需要移除的监听器回调函数。
   */
  removeKernelStorageCleanListener: (listener: StorageCleanListener) => void

  /**
   * 添加缓存扫描路径，用于指定需要扫描的缓存文件路径。
   * @param paths - 缓存文件路径列表。
   */
  addCacheScanedPaths: (paths: string[]) => void

  /**
   * 添加文件扫描路径，用于指定需要扫描的普通文件路径。
   * @param paths - 文件路径列表。
   */
  addFilesScanedPaths: (paths: string[]) => void

  /**
   * 开始缓存扫描，以获取缓存文件的信息。
   * @returns 扫描结果或状态。
   */
  scanCache: () => any

  /**
   * 添加报告数据，用于记录扫描或清理的统计信息。
   * @param data - 要添加的报告数据。
   */
  addReportData: (data: any) => void

  /**
   * 发送当前的报告数据。
   * @returns 是否成功发送报告数据。
   */
  reportData: () => boolean

  /**
   * 获取聊天缓存信息。
   * @returns 聊天缓存的信息（如大小、路径等）。
   */
  getChatCacheInfo: () => any

  /**
   * 获取文件缓存信息。
   * @returns 文件缓存的信息（如大小、路径等）。
   */
  getFileCacheInfo: () => any

  /**
   * 清除指定的聊天缓存信息。
   * @returns 是否成功清除聊天缓存。
   */
  clearChatCacheInfo: () => boolean

  /**
   * 根据指定的键清理缓存数据。
   * @param keys - 需要清除的缓存数据的键。
   * @returns 是否成功清理指定缓存。
   */
  clearCacheDataByKeys: (keys: string[]) => boolean

  /**
   * 设置静默扫描模式，使扫描在后台进行。
   * @param isSilent - 是否启用静默扫描。
   */
  setSilentScan: (isSilent: boolean) => void

  /**
   * 关闭存储清理窗口。
   */
  closeCleanWindow: () => void

  /**
   * 清除所有聊天缓存信息。
   * @returns 是否成功清除所有聊天缓存。
   */
  clearAllChatCacheInfo: () => boolean

  /**
   * 结束当前的扫描过程。
   */
  endScan: () => void

  /**
   * 添加新下载或上传的文件路径，以便后续进行扫描或清理。
   * @param filePath - 新的文件路径。
   */
  addNewDownloadOrUploadFile: (filePath: string) => void
}
