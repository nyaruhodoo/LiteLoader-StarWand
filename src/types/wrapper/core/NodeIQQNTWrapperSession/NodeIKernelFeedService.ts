interface FeedListener {
  /**
   * 当富媒体下载完成时调用的回调函数
   */
  onFeedRichMediaDownloadComplete: () => void

  /**
   * 富媒体下载进度更新时调用的回调函数
   */
  onFeedRichMediaProgressUpdate: () => void
}

// 定义 `NodeIKernelFeedService` 接口
export interface NodeIKernelFeedService {
  /**
   * 添加一个动态监听器
   * @param listener - 监听器对象
   */
  addKernelFeedListener: (listener: FeedListener) => void

  /**
   * 移除动态监听器
   * @param listener - 监听器对象
   */
  removeKernelFeedListener: (listener: FeedListener) => void

  /**
   * 获取频道动态列表
   * @param channelId - 频道ID
   * @returns - 返回动态列表
   */
  getChannelFeeds: (channelId: string) => any[]

  /**
   * 获取动态详情
   * @param feedId - 动态ID
   * @returns - 返回动态详情
   */
  getFeedDetail: (feedId: string) => any

  /**
   * 评论动态
   * @param feedId - 动态ID
   * @param comment - 评论内容
   * @returns - 操作结果
   */
  doCommentForFeed: (feedId: string, comment: any) => any

  /**
   * 获取频道动态评论列表
   * @param feedId - 动态ID
   * @returns - 返回评论列表
   */
  getChannelFeedComments: (feedId: string) => any[]

  /**
   * 举报动态
   * @param feedId - 动态ID
   * @param reason - 举报原因
   * @returns - 操作结果
   */
  setFeedImpeach: (feedId: string, reason: string) => any

  /**
   * 回复动态评论
   * @param feedId - 动态ID
   * @param commentId - 评论ID
   * @param reply - 回复内容
   * @returns - 操作结果
   */
  doReplyForFeed: (feedId: string, commentId: string, reply: any) => any

  /**
   * 点赞动态
   * @param feedId - 动态ID
   * @returns - 操作结果
   */
  doLike: (feedId: string) => any

  /**
   * 发布新动态
   * @param feedData - 动态内容数据
   * @returns - 操作结果
   */
  publishFeed: (feedData: any) => any

  /**
   * 修改动态
   * @param feedId - 动态ID
   * @param feedData - 要修改的数据
   * @returns - 操作结果
   */
  alterFeed: (feedId: string, feedData: any) => any

  /**
   * 从数据库中获取动态详情
   * @param feedId - 动态ID
   * @returns - 返回动态详情
   */
  getFeedDetailFromDB: (feedId: string) => any

  /**
   * 将动态详情存入数据库
   * @param feedId - 动态ID
   * @param feedData - 动态数据
   */
  setFeedDetailToDB: (feedId: string, feedData: any) => void

  /**
   * 获取频道的草稿
   * @param channelId - 频道ID
   * @returns - 返回频道草稿
   */
  getChannelDraft: (channelId: string) => any

  /**
   * 设置频道的草稿
   * @param channelId - 频道ID
   * @param draftData - 草稿数据
   */
  setChannelDraft: (channelId: string, draftData: any) => void

  /**
   * 下载动态的富媒体内容
   * @param mediaId - 媒体ID
   * @returns - 下载结果
   */
  downloadFeedRichMedia: (mediaId: string) => Promise<any>

  /**
   * 下载动态的URL文件
   * @param url - 文件的URL
   * @returns - 下载结果
   */
  downloadFeedUrlFile: (url: string) => Promise<any>

  /**
   * 获取动态富媒体文件路径
   * @param mediaId - 媒体ID
   * @returns - 返回文件路径
   */
  getFeedRichMediaFilePath: (mediaId: string) => string

  /**
   * 获取公会动态列表
   * @param guildId - 公会ID
   * @returns - 返回动态列表
   */
  getGuildFeeds: (guildId: string) => any[]
}
