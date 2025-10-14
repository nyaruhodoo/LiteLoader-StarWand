interface SearchListener {
  /**
   * 当搜索结果返回时调用的回调函数
   */
  onSearchResult: () => void

  /**
   * 当群组搜索结果返回时调用的回调函数
   */
  onSearchGroupResult: () => void

  /**
   * 当机器人搜索结果返回时调用的回调函数
   */
  onSearchRobotResult: () => void

  /**
   * 当本地信息搜索结果返回时调用的回调函数
   */
  onSearchLocalInfoResult: () => void

  /**
   * 当好友聊天信息搜索结果返回时调用的回调函数
   */
  onSearchBuddyChatInfoResult: () => void

  /**
   * 当联系人搜索结果返回时调用的回调函数
   */
  onSearchContactResult: () => void

  /**
   * 当群组聊天信息搜索结果返回时调用的回调函数
   */
  onSearchGroupChatInfoResult: () => void

  /**
   * 当聊天关键字搜索结果返回时调用的回调函数
   */
  onSearchChatsKeywordsResult: () => void

  /**
   * 当消息关键字搜索结果返回时调用的回调函数
   */
  onSearchMsgKeywordsResult: () => void

  /**
   * 当文件关键字搜索结果返回时调用的回调函数
   */
  onSearchFileKeywordsResult: () => void

  /**
   * 当@我的聊天结果返回时调用的回调函数
   */
  onSearchAtMeChatsResult: () => void

  /**
   * 当@我的消息结果返回时调用的回调函数
   */
  onSearchAtMeMsgsResult: () => void

  /**
   * 当缓存搜索结果返回时调用的回调函数
   */
  onSearchCacheResult: () => void
}

export interface NodeIKernelSearchService {
  /**
   * 添加内核搜索监听器
   * @param listener - 监听器函数
   */
  addKernelSearchListener: (listener: SearchListener) => void

  /**
   * 移除内核搜索监听器
   * @param listener - 要移除的监听器函数
   */
  removeKernelSearchListener: (listener: SearchListener) => void

  /**
   * 搜索陌生人
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchStranger: (query: string) => Promise<any>

  /**
   * 搜索群组
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchGroup: (query: string) => Promise<any>

  /**
   * 搜索机器人
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchRobot: (query: string) => Promise<any>

  /**
   * 搜索本地信息
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchLocalInfo: (query: string) => Promise<any>

  /**
   * 取消搜索本地信息
   */
  cancelSearchLocalInfo: () => void

  /**
   * 搜索好友聊天信息
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchBuddyChatInfo: (query: string) => Promise<any>

  /**
   * 搜索更多好友聊天信息
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchMoreBuddyChatInfo: (query: string) => Promise<any>

  /**
   * 取消搜索好友聊天信息
   */
  cancelSearchBuddyChatInfo: () => void

  /**
   * 搜索联系人
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchContact: (query: string) => Promise<any>

  /**
   * 搜索更多联系人
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchMoreContact: (query: string) => Promise<any>

  /**
   * 取消搜索联系人
   */
  cancelSearchContact: () => void

  /**
   * 搜索群聊信息
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchGroupChatInfo: (query: string) => Promise<any>

  /**
   * 重置群聊信息排序类型
   */
  resetSearchGroupChatInfoSortType: () => void

  /**
   * 重置群聊信息成员过滤
   */
  resetSearchGroupChatInfoFilterMembers: () => void

  /**
   * 搜索更多群聊信息
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchMoreGroupChatInfo: (query: string) => Promise<any>

  /**
   * 取消搜索群聊信息
   */
  cancelSearchGroupChatInfo: () => void

  /**
   * 使用关键词搜索聊天记录
   * @param keywords - 关键词
   * @returns 搜索结果
   */
  searchChatsWithKeywords: (keywords: string) => Promise<any>

  /**
   * 搜索更多聊天记录
   * @param keywords - 关键词
   * @returns 搜索结果
   */
  searchMoreChatsWithKeywords: (keywords: string) => Promise<any>

  /**
   * 取消搜索聊天记录
   */
  cancelSearchChatsWithKeywords: () => void

  /**
   * 搜索聊天消息
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchChatMsgs: (query: string) => Promise<any>

  /**
   * 搜索更多聊天消息
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchMoreChatMsgs: (query: string) => Promise<any>

  /**
   * 取消搜索聊天消息
   */
  cancelSearchChatMsgs: () => void

  /**
   * 使用关键词搜索消息
   * @param keywords - 关键词
   * @returns 搜索结果
   */
  searchMsgWithKeywords: (keywords: string) => Promise<any>

  /**
   * 搜索更多消息
   * @param keywords - 关键词
   * @returns 搜索结果
   */
  searchMoreMsgWithKeywords: (keywords: string) => Promise<any>

  /**
   * 取消搜索消息
   */
  cancelSearchMsgWithKeywords: () => void

  /**
   * 使用关键词搜索文件
   * @param keywords - 关键词
   * @returns 搜索结果
   */
  searchFileWithKeywords: (keywords: string) => Promise<any>

  /**
   * 搜索更多文件
   * @param keywords - 关键词
   * @returns 搜索结果
   */
  searchMoreFileWithKeywords: (keywords: string) => Promise<any>

  /**
   * 取消搜索文件
   */
  cancelSearchFileWithKeywords: () => void

  /**
   * 搜索提到我的聊天记录
   * @returns 搜索结果
   */
  searchAtMeChats: () => Promise<any>

  /**
   * 搜索更多提到我的聊天记录
   * @returns 搜索结果
   */
  searchMoreAtMeChats: () => Promise<any>

  /**
   * 取消搜索提到我的聊天记录
   */
  cancelSearchAtMeChats: () => void

  /**
   * 搜索提到我的消息
   * @returns 搜索结果
   */
  searchChatAtMeMsgs: () => Promise<any>

  /**
   * 搜索更多提到我的消息
   * @returns 搜索结果
   */
  searchMoreChatAtMeMsgs: () => Promise<any>

  /**
   * 取消搜索提到我的消息
   */
  cancelSearchAtMeMsgs: () => void

  /**
   * 加载搜索历史
   * @returns 搜索历史记录
   */
  loadSearchHistory: () => Promise<any>

  /**
   * 清除搜索历史
   */
  clearSearchHistory: () => void

  /**
   * 添加搜索历史
   * @param history - 要添加的历史记录
   */
  addSearchHistory: (history: any) => void

  /**
   * 移除搜索历史
   * @param history - 要移除的历史记录
   */
  removeSearchHistory: (history: any) => void

  /**
   * 搜索缓存
   * @param query - 搜索字符串
   * @returns 搜索结果
   */
  searchCache: (query: string) => Promise<any>

  /**
   * 清除搜索缓存
   */
  clearSearchCache: () => void
}
