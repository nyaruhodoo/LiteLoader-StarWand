interface CollectionListener {
  /**
   * 当下载收藏文件开始时调用的回调函数
   */
  onDownloadCollectionFileStart: () => void

  /**
   * 当下载收藏文件进度更新时调用的回调函数
   */
  onDownloadCollectionFileProgress: () => void

  /**
   * 当下载收藏文件完成时调用的回调函数
   */
  onDownloadCollectionFileComplete: () => void

  /**
   * 当成功编辑收藏项时调用的回调函数
   */
  onEditCollectionItemSuccess: () => void

  /**
   * 当成功创建新的收藏项时调用的回调函数
   */
  onCreateNewCollectionItemSuccess: () => void
}

export interface NodeIKernelCollectionService {
  /**
   * 添加一个收藏监听器
   * @param listener - 监听器对象
   */
  addKernelCollectionListener: (listener: CollectionListener) => void

  /**
   * 移除一个收藏监听器
   * @param listener - 监听器对象
   */
  removeKernelCollectionListener: (listener: CollectionListener) => void

  /**
   * 获取收藏项列表
   * @returns - 返回一个包含收藏项的列表
   */
  getCollectionItemList: () => any[]

  /**
   * 获取收藏内容
   * @param id - 收藏项的唯一标识符
   * @returns - 返回指定收藏项的内容
   */
  getCollectionContent: (id: string) => any

  /**
   * 获取收藏的自定义分组列表
   * @returns - 返回一个包含自定义分组的列表
   */
  getCollectionCustomGroupList: () => any[]

  /**
   * 获取用户收藏信息
   * @returns - 返回用户的收藏信息
   */
  getCollectionUserInfo: () => any

  /**
   * 搜索收藏项列表
   * @param query - 搜索查询条件
   * @returns - 返回匹配条件的收藏项列表
   */
  searchCollectionItemList: (query: string) => any[]

  /**
   * 添加消息到收藏
   * @param message - 要添加的消息对象
   * @returns - 操作结果
   */
  addMsgToCollection: (message: any) => any

  /**
   * 处理收藏Ark分享
   * @param ark - Ark分享对象
   * @returns - 操作结果
   */
  collectionArkShare: (ark: any) => any

  /**
   * 收藏文件转发
   * @param file - 文件对象
   * @returns - 操作结果
   */
  collectionFileForward: (file: any) => any

  /**
   * 下载收藏文件
   * @param fileId - 文件的唯一标识符
   * @returns - 操作结果
   */
  downloadCollectionFile: (fileId: string) => Promise<any>

  /**
   * 下载收藏文件的缩略图
   * @param fileId - 文件的唯一标识符
   * @returns - 操作结果
   */
  downloadCollectionFileThumbPic: (fileId: string) => Promise<any>

  /**
   * 下载收藏图片
   * @param imageId - 图片的唯一标识符
   * @returns - 操作结果
   */
  downloadCollectionPic: (imageId: string) => Promise<any>

  /**
   * 取消下载收藏文件
   * @param fileId - 文件的唯一标识符
   */
  cancelDownloadCollectionFile: (fileId: string) => void

  /**
   * 删除收藏项列表
   * @param ids - 要删除的收藏项ID列表
   * @returns - 操作结果
   */
  deleteCollectionItemList: (ids: string[]) => any

  /**
   * 编辑收藏项
   * @param id - 收藏项的唯一标识符
   * @param data - 要更新的数据
   * @returns - 操作结果
   */
  editCollectionItem: (id: string, data: any) => any

  /**
   * 根据路径获取图片编辑信息
   * @param path - 图片的路径
   * @returns - 图片的编辑信息
   */
  getEditPicInfoByPath: (path: string) => any

  /**
   * 快速上传收藏项
   * @param data - 要上传的数据
   * @returns - 操作结果
   */
  collectionFastUpload: (data: any) => any

  /**
   * 快速上传后编辑收藏项
   * @param id - 收藏项的唯一标识符
   * @param data - 要更新的数据
   * @returns - 操作结果
   */
  editCollectionItemAfterFastUpload: (id: string, data: any) => any

  /**
   * 创建新的收藏项
   * @param data - 收藏项数据
   * @returns - 创建结果
   */
  createNewCollectionItem: (data: any) => any
}
