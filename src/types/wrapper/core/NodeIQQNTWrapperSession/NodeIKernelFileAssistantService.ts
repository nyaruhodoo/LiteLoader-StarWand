interface FileAssistantListener {
  /**
   * 当会话列表发生变化时调用的回调函数
   */
  onSessionListChanged: () => void

  /**
   * 当某个会话发生变化时调用的回调函数
   */
  onSessionChanged: () => void

  /**
   * 当文件列表发生变化时调用的回调函数
   */
  onFileListChanged: () => void

  /**
   * 当文件搜索操作触发时调用的回调函数
   */
  onFileSearch: () => void

  /**
   * 当文件状态发生变化时调用的回调函数
   */
  onFileStatusChanged: () => void
}

export interface NodeIKernelFileAssistantService {
  /**
   * 添加文件助手监听器
   * @param listener - 监听器对象
   */
  addKernelFileAssistantListener: (listener: FileAssistantListener) => void

  /**
   * 移除文件助手监听器
   * @param listener - 监听器对象
   */
  removeKernelFileAssistantListener: (listener: FileAssistantListener) => void

  /**
   * 获取文件助手列表
   * @returns - 返回文件助手列表
   */
  getFileAssistantList: () => any[]

  /**
   * 获取更多文件助手列表
   * @returns - 返回更多文件助手列表
   */
  getMoreFileAssistantList: () => any[]

  /**
   * 获取文件会话列表
   * @returns - 返回文件会话列表
   */
  getFileSessionList: () => any[]

  /**
   * 搜索文件
   * @param query - 搜索关键词
   * @returns - 返回搜索结果
   */
  searchFile: (query: string) => any[]

  /**
   * 重置文件搜索排序类型
   */
  resetSearchFileSortType: () => void

  /**
   * 搜索更多文件
   * @param query - 搜索关键词
   * @returns - 返回更多搜索结果
   */
  searchMoreFile: (query: string) => any[]

  /**
   * 取消文件搜索
   */
  cancelSearchFile: () => void

  /**
   * 下载文件
   * @param fileId - 文件ID
   * @returns - 下载结果
   */
  downloadFile: (fileId: string) => Promise<any>

  /**
   * 转发文件
   * @param fileId - 文件ID
   * @param targetId - 目标ID
   * @returns - 转发结果
   */
  forwardFile: (fileId: string, targetId: string) => any

  /**
   * 取消文件操作
   * @param actionId - 操作ID
   * @returns - 取消结果
   */
  cancelFileAction: (actionId: string) => any

  /**
   * 重试文件操作
   * @param actionId - 操作ID
   * @returns - 重试结果
   */
  retryFileAction: (actionId: string) => any

  /**
   * 删除文件
   * @param fileId - 文件ID
   * @returns - 删除结果
   */
  deleteFile: (fileId: string) => any

  /**
   * 另存为文件
   * @param fileId - 文件ID
   * @param path - 目标路径
   * @returns - 操作结果
   */
  saveAs: (fileId: string, path: string) => any

  /**
   * 另存为文件并重命名
   * @param fileId - 文件ID
   * @param path - 目标路径
   * @param newName - 新文件名
   * @returns - 操作结果
   */
  saveAsWithRename: (fileId: string, path: string, newName: string) => any

  /**
   * 修改文件信息
   * @param fileId - 文件ID
   * @param fileInfo - 新的文件信息
   * @returns - 操作结果
   */
  modifyFileInfo: (fileId: string, fileInfo: any) => any
}
