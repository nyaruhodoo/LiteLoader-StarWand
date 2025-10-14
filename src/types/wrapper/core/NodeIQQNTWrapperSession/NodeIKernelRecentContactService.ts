interface RecentContactListener {
  /**
   * 当最近联系人列表发生变化时调用的回调函数
   */
  onRecentContactListChanged: () => void

  /**
   * 最近联系人列表发生变化（第二版本）时调用的回调函数
   */
  onRecentContactListChangedVer2: () => void

  /**
   * 当群组显示的最近联系人列表发生变化时调用的回调函数
   */
  onGuildDisplayRecentContactListChanged: () => void

  /**
   * 当最近联系人收到通知时调用的回调函数
   */
  onRecentContactNotification: () => void

  /**
   * 当未读消息计数更新时调用的回调函数
   */
  onMsgUnreadCountUpdate: () => void

  /**
   * 当联系人被删除时调用的回调函数
   */
  onDeletedContactsNotify: () => void
}

export interface NodeIKernelRecentContactService {
  /**
   * 注册一个监听器，用于监听最近联系人服务的变化。
   * @param listener - 当最近联系人列表更新时调用的回调函数。
   */
  addKernelRecentContactListener: (listener: RecentContactListener) => void

  /**
   * 移除已经注册的最近联系人服务监听器。
   * @param listener - 需要移除的监听器回调函数。
   */
  removeKernelRecentContactListener: (listener: RecentContactListener) => void

  /**
   * 获取最近联系人列表。
   * @returns 最近联系人的列表。
   */
  getRecentContactList: () => any[]

  /**
   * 获取并订阅一批最近联系人。
   * @param count - 要获取的联系人数量。
   * @returns 订阅的联系人列表。
   */
  fetchAndSubscribeABatchOfRecentContact: (count: number) => any[]

  /**
   * 同步获取最近联系人列表。
   * @returns 同步获取的最近联系人列表。
   */
  getRecentContactListSync: () => any[]

  /**
   * 同步获取带有数量限制的最近联系人列表。
   * @param limit - 获取的最大联系人数量。
   * @returns 限制数量的最近联系人列表。
   */
  getRecentContactListSyncLimit: (limit: number) => any[]

  /**
   * 获取最近联系人列表的快照。
   * @returns 最近联系人列表的快照数据。
   */
  getRecentContactListSnapShot: () => any[]

  /**
   * 获取未读消息的计数。
   * @returns 未读消息的数量。
   */
  getMsgUnreadCount: () => number

  /**
   * 删除指定的最近联系人。
   * @param contactIds - 需要删除的联系人 ID 列表。
   */
  deleteRecentContacts: (contactIds: string[]) => void

  /**
   * 删除指定版本的最近联系人。
   * @param contactIds - 需要删除的联系人 ID 列表。
   */
  deleteRecentContactsVer2: (contactIds: string[]) => void

  /**
   * 清空所有最近联系人。
   */
  clearRecentContacts: () => void

  /**
   * 根据聊天类型清空最近联系人。
   * @param chatType - 聊天类型标识符。
   */
  clearRecentContactsByChatType: (chatType: string) => void

  /**
   * 清除未读消息计数。
   * @param contactId - 指定联系人 ID。
   */
  clearMsgUnreadCount: (contactId: string) => void

  /**
   * 添加一个新的最近联系人。
   * @param contact - 要添加的联系人信息。
   */
  addRecentContact: (contact: any) => void

  /**
   * 手动更新或插入一个最近联系人。
   * @param contact - 要插入或更新的联系人信息。
   */
  upsertRecentContactManually: (contact: any) => void

  /**
   * 设置公会显示状态。
   * @param guildId - 公会的 ID。
   * @param isVisible - 是否显示。
   */
  setGuildDisplayStatus: (guildId: string, isVisible: boolean) => void

  /**
   * 插入或更新模块。
   * @param moduleInfo - 模块信息。
   */
  upInsertModule: (moduleInfo: any) => void

  /**
   * 清空所有模块。
   */
  cleanAllModule: () => void

  /**
   * 跳转到指定的最近联系人。
   * @param contactId - 要跳转的联系人 ID。
   */
  jumpToSpecifyRecentContact: (contactId: string) => void

  /**
   * 使用版本 2 跳转到指定的最近联系人。
   * @param contactId - 要跳转的联系人 ID。
   */
  jumpToSpecifyRecentContactVer2: (contactId: string) => void

  /**
   * 更新 UI 所用的最近联系人扩展数据。
   * @param contactId - 联系人 ID。
   * @param extBuf - 扩展数据缓冲。
   */
  // eslint-disable-next-line node/prefer-global/buffer
  updateRecentContactExtBufForUI: (contactId: string, extBuf: Buffer<ArrayBuffer>) => void

  /**
   * 设置联系人列表的置顶状态。
   * @param contactId - 联系人 ID。
   * @param isTop - 是否置顶。
   */
  setContactListTop: (contactId: string, isTop: boolean) => void

  /**
   * 获取联系人信息。
   * @returns 联系人信息列表。
   */
  getContacts: () => any[]

  /**
   * 更新游戏消息的配置信息。
   * @param config - 配置信息。
   */
  updateGameMsgConfigs: (config: any) => void

  /**
   * 将所有游戏消息标记为已读。
   */
  setAllGameMsgRead: () => void

  /**
   * 获取最近联系人的详细信息。
   * @returns 最近联系人的详细信息列表。
   */
  getRecentContactInfos: () => any[]

  /**
   * 获取未读消息的详细信息。
   * @returns 未读消息的详细信息。
   */
  getUnreadDetailsInfos: () => any[]

  /**
   * 进入或退出消息列表界面。
   * @param isEnter - 是否进入消息列表。
   */
  enterOrExitMsgList: (isEnter: boolean) => void

  /**
   * 获取服务助手的最近联系人信息。
   * @returns 服务助手的最近联系人信息。
   */
  getServiceAssistantRecentContactInfos: () => any[]

  /**
   * 设置第三方业务信息。
   * @param businessInfo - 业务信息。
   */
  setThirdPartyBusinessInfos: (businessInfo: any) => void
}
