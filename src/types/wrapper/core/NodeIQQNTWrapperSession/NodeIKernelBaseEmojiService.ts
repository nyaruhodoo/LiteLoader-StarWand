export interface NodeIKernelBaseEmojiService {
  /**
   * 注册一个监听器，用于接收基础表情相关的事件通知。
   * @param listener - 事件监听器函数
   */
  addKernelBaseEmojiListener: (listener: () => void) => void

  /**
   * 移除已注册的基础表情事件监听器。
   * @param listener - 要移除的事件监听器函数
   */
  removeKernelBaseEmojiListener: (listener: () => void) => void

  /**
   * 获取系统中可用的所有表情。
   * @returns - 返回完整的系统表情列表
   */
  fetchFullSysEmojis: () => any[]

  /**
   * 根据表情 ID 获取基础表情的路径。
   * @param ids - 表情的唯一标识符数组
   * @returns - 返回对应表情路径的数组
   */
  getBaseEmojiPathByIds: (ids: string[]) => string[]

  /**
   * 检查基础表情的路径是否存在。
   * @param path - 表情路径
   * @returns - 返回是否存在的布尔值
   */
  isBaseEmojiPathExist: (path: string) => boolean

  /**
   * 根据表情 ID 和 URL 下载基础表情。
   * @param id - 表情的唯一标识符
   * @param url - 表情的下载 URL
   * @returns - 返回下载结果的对象
   */
  downloadBaseEmojiByIdWithUrl: (id: string, url: string) => any

  /**
   * 根据表情 ID 下载基础表情。
   * @param id - 表情的唯一标识符
   * @returns - 返回下载结果的对象
   */
  downloadBaseEmojiById: (id: string) => any
}
