/**
 * 好友服务事件监听器接口，用于处理与好友相关的各种事件。
 */
interface KernelBuddyListener {
  /**
   * 好友列表变更时触发
   */
  onBuddyListChange: () => void

  /**
   * 好友列表变更 (版本2) 时触发
   */
  onBuddyListChangedV2: () => void

  /**
   * 好友被删除时触发
   */
  onBuddyDeleted: () => void

  /**
   * 好友昵称更新时触发
   */
  onNickUpdated: () => void

  /**
   * 好友备注更新时触发
   */
  onBuddyRemarkUpdated: () => void

  /**
   * 好友头像 URL 更新时触发
   */
  onAvatarUrlUpdated: () => void

  /**
   * 好友请求变化时触发
   */
  onBuddyReqChange: () => void

  /**
   * 好友请求未读计数变化时触发
   */
  onBuddyReqUnreadCntChange: () => void

  /**
   * 检查好友设置结果时触发
   */
  onCheckBuddySettingResult: () => void

  /**
   * 添加好友需要验证时触发
   */
  onAddBuddyNeedVerify: () => void

  /**
   * 智能信息更新时触发
   */
  onSmartInfos: () => void

  /**
   * 空间权限信息更新时触发
   */
  onSpacePermissionInfos: () => void

  /**
   * 可疑好友请求变化时触发
   */
  onDoubtBuddyReqChange: () => void

  /**
   * 可疑好友请求未读数变化时触发
   */
  onDoubtBuddyReqUnreadNumChange: () => void

  /**
   * 阻止列表变化时触发
   */
  onBlockChanged: () => void

  /**
   * “加我”设置变化时触发
   */
  onAddMeSettingChanged: () => void

  /**
   * 批量删除好友信息时触发
   */
  onDelBatchBuddyInfos: () => void
}

export interface NodeIKernelBuddyService {
  /**
   * 注册一个监听器，用于接收好友相关的事件通知。
   * @param listener - 事件监听器函数
   */
  addKernelBuddyListener: (listener: KernelBuddyListener) => void

  /**
   * 移除已注册的好友事件监听器。
   * @param listener - 要移除的事件监听器函数
   */
  removeKernelBuddyListener: (listener: KernelBuddyListener) => void

  /**
   * 获取好友列表。
   * @returns - 返回好友列表的数组
   */
  getBuddyList: () => any[]

  /**
   * 获取指定好友的昵称。
   * @param uid - 好友的唯一标识符
   * @returns - 返回好友昵称的字符串
   */
  getBuddyNick: (uid: string) => string

  /**
   * 获取指定好友的备注名。
   * @param uid - 好友的唯一标识符
   * @returns - 返回好友备注名的字符串
   */
  getBuddyRemark: (uid: string) => string

  /**
   * 设置好友的备注名。
   * @param uid - 好友的唯一标识符
   * @param remark - 新的备注名
   */
  setBuddyRemark: (uid: string, remark: string) => void

  /**
   * 检查指定用户是否是好友。
   * @param uid - 用户的唯一标识符
   * @returns - 如果是好友返回 true，否则返回 false
   */
  isBuddy: (uid: string) => boolean

  /**
   * 根据用户 ID 获取分类名称。
   * @param uid - 好友的唯一标识符
   * @returns - 返回分类名称的字符串
   */
  getCategoryNameWithUid: (uid: string) => string

  /**
   * 获取指定好友的设置。
   * @param uid - 好友的唯一标识符
   * @returns - 返回好友设置的对象
   */
  getTargetBuddySetting: (uid: string) => any

  /**
   * 根据类型获取指定好友的设置。
   * @param uid - 好友的唯一标识符
   * @param type - 设置类型
   * @returns - 返回好友设置的对象
   */
  getTargetBuddySettingByType: (uid: string, type: string) => any

  /**
   * 获取好友请求未读数量。
   * @returns - 返回未读好友请求的数量
   */
  getBuddyReqUnreadCnt: () => number

  /**
   * 获取好友请求列表。
   * @returns - 返回好友请求的数组
   */
  getBuddyReq: () => any[]

  /**
   * 删除指定好友请求。
   * @param reqId - 好友请求的唯一标识符
   */
  delBuddyReq: (reqId: string) => void

  /**
   * 清除好友请求的未读计数。
   */
  clearBuddyReqUnreadCnt: () => void

  /**
   * 请求添加好友。
   * @param uid - 好友的唯一标识符
   */
  reqToAddFriends: (uid: string) => void

  /**
   * 设置好友的空间权限。
   * @param uid - 好友的唯一标识符
   * @param permission - 空间权限设置
   */
  setSpacePermission: (uid: string, permission: any) => void

  /**
   * 审批好友请求。
   * @param reqId - 好友请求的唯一标识符
   */
  approvalFriendRequest: (reqId: string) => void

  /**
   * 删除好友。
   * @param uid - 好友的唯一标识符
   */
  delBuddy: (uid: string) => void

  /**
   * 批量删除好友。
   * @param uids - 好友的唯一标识符数组
   */
  delBatchBuddy: (uids: string[]) => void

  /**
   * 获取智能信息。
   * @returns - 返回智能信息的对象
   */
  getSmartInfos: () => any

  /**
   * 设置好友分类。
   * @param uid - 好友的唯一标识符
   * @param category - 新的分类名称
   */
  setBuddyCategory: (uid: string, category: string) => void

  /**
   * 批量设置好友分类。
   * @param uids - 好友的唯一标识符数组
   * @param category - 新的分类名称
   */
  setBatchBuddyCategory: (uids: string[], category: string) => void

  /**
   * 添加新的好友分类。
   * @param name - 新分类的名称
   */
  addCategory: (name: string) => void

  /**
   * 删除指定的好友分类。
   * @param categoryId - 分类的唯一标识符
   */
  delCategory: (categoryId: string) => void

  /**
   * 重命名好友分类。
   * @param categoryId - 分类的唯一标识符
   * @param newName - 新分类名称
   */
  renameCategory: (categoryId: string, newName: string) => void

  /**
   * 重新排序好友分类。
   * @param categoryId - 分类的唯一标识符
   * @param position - 新的排序位置
   */
  resortCategory: (categoryId: string, position: number) => void

  /**
   * 拉取分类信息。
   * @returns - 返回分类信息的数组
   */
  pullCategory: () => any[]

  /**
   * 设置指定好友为置顶。
   * @param uid - 好友的唯一标识符
   */
  setTop: (uid: string) => void

  /**
   * 设置特殊关怀状态。
   * @param uid - 好友的唯一标识符
   * @param specialCare - 特殊关怀标记
   */
  SetSpecialCare: (uid: string, specialCare: boolean) => void

  /**
   * 设置消息通知偏好。
   * @param uid - 好友的唯一标识符
   * @param notify - 消息通知偏好设置
   */
  setMsgNotify: (uid: string, notify: any) => void

  /**
   * 检查是否有好友列表。
   * @returns - 如果有好友列表返回 true，否则返回 false
   */
  hasBuddyList: () => boolean

  /**
   * 设置好友为黑名单。
   * @param uid - 好友的唯一标识符
   */
  setBlock: (uid: string) => void

  /**
   * 检查指定好友是否被拉黑。
   * @param uid - 好友的唯一标识符
   * @returns - 如果已拉黑返回 true，否则返回 false
   */
  isBlocked: (uid: string) => boolean

  /**
   * 修改添加我为好友的设置。
   * @param setting - 新的设置对象
   */
  modifyAddMeSetting: (setting: any) => void

  /**
   * 获取添加我为好友的设置。
   * @returns - 返回设置对象
   */
  getAddMeSetting: () => any

  /**
   * 获取怀疑的好友请求。
   * @returns - 返回怀疑好友请求的数组
   */
  getDoubtBuddyReq: () => any[]

  /**
   * 获取怀疑好友请求的未读数量。
   * @returns - 返回未读数量
   */
  getDoubtBuddyUnreadNum: () => number

  /**
   * 审批怀疑的好友请求。
   * @param reqId - 请求的唯一标识符
   */
  approvalDoubtBuddyReq: (reqId: string) => void

  /**
   * 删除怀疑的好友请求。
   * @param reqId - 请求的唯一标识符
   */
  delDoubtBuddyReq: (reqId: string) => void

  /**
   * 删除所有怀疑的好友请求。
   */
  delAllDoubtBuddyReq: () => void

  /**
   * 报告怀疑好友请求的未读状态。
   * @param reqId - 请求的唯一标识符
   */
  reportDoubtBuddyReqUnread: (reqId: string) => void

  /**
   * 获取好友推荐的联系人。
   * @returns - 返回好友推荐联系人的 JSON 对象
   */
  getBuddyRecommendContactArkJson: () => any

  /**
   * 获取好友列表的第二版。
   * @returns - 返回新的好友列表
   */
  getBuddyListV2: () => any[]

  /**
   * 从缓存获取好友列表。
   * @returns - 返回缓存中的好友列表
   */
  getBuddyListFromCache: () => any[]

  /**
   * 根据分类 ID 获取分类信息。
   * @param categoryId - 分类的唯一标识符
   * @returns - 返回分类信息的对象
   */
  getCategoryById: (categoryId: string) => any

  /**
   * 获取所有好友的数量。
   * @returns - 返回好友总数
   */
  getAllBuddyCount: () => number

  /**
   * 检查好友列表是否为新版本。
   * @returns - 如果是新版本返回 true，否则返回 false
   */
  isNewBuddylistVersion: () => boolean
}
