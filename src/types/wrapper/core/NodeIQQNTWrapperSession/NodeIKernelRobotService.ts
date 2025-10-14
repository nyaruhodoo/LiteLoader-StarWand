interface KernelRobotListener {
  /**
   * 当机器人好友列表发生变化时触发
   */
  onRobotFriendListChanged: () => void

  /**
   * 当机器人列表发生变化时触发
   */
  onRobotListChanged: () => void

  /**
   * 当机器人标签列表发生变化时触发
   */
  onRobotTabListChanged: () => void

  /**
   * 当机器人资料发生变化时触发
   */
  onRobotProfileChanged: () => void
}

export interface NodeIKernelRobotService {
  /** 获取共享信息 */
  fetchShareInfo: (robotId: string) => Promise<any>

  /** 重置会话 */
  resetConversation: (groupId: string) => Promise<void>

  /** 获取机器人功能 */
  getRobotunknowns: (robotId: string) => Promise<string[]>

  /** 批量获取机器人的菜单 */
  batchGetBotsMenu: (botIds: string[]) => Promise<any[]>

  /** 获取群组机器人配置 */
  fetchGroupRobotProfile: (groupId: string) => Promise<any>

  /** 获取群组机器人资料 */
  getGroupRobotProfile: (groupId: string) => Promise<any>

  /** 带请求的获取群组机器人资料 */
  fetchGroupRobotProfileWithReq: (params: { fetchType: number, robotUin: string }) => WrapperAsyncResponse<{
    robotData: {
      robotUin: string // 机器人唯一ID
      name: string // 机器人名称
      status: number // 状态
      desc: string // 描述
      robotAvatar: string // 机器人头像
      enabledGroups: number // 启用的群组数量
      welcomeMsg: string // 欢迎消息
      callName: string // 呼叫名称
      allowedAddGroup: boolean // 是否允许添加到群组
      offline: number // 离线状态
      verify: string // 验证信息
      fallback: string // 后备信息
      joinTime: number // 加入时间
      order: number // 排序
      appid: string // 应用ID
      apiMark: string // API标识
      miniAppIds: string // 小程序ID
      robotType: number // 机器人类型
      extraInfo: string // 额外信息
      allowedAddC2C: boolean // 是否允许添加到C2C
      robotUid: string // 机器人用户ID
      ownerEntity: string // 所有者实体
      robotBizType: number // 机器人业务类型
      createInfo: {
        createName: string // 创建者名称
        createUid: string // 创建者用户ID
      }
      robotStatus: number // 机器人状态
    } // 机器人数据
    userMembership: number // 用户成员身份
    robotMembership: number // 机器人成员身份
    isFriend: boolean // 是否是好友
    usingLabels: string[] // 使用的标签
    panels: any[] // 面板数据
    commands: any[] // 命令数据
    previewImages: any[] // 预览图片
    isReceive: boolean // 是否接收
    canResetHistory: boolean // 是否可以重置历史
    isGroupReceive: boolean // 是否群接收
    jumpUrl: string // 跳转URL
    subscribeMsgTplCnt: number // 订阅消息模板数量
    panelTitle: string // 面板标题
    previewImagesTitle: string // 预览图片标题
    traceInfo: {
      addOperatorUid: string // 添加操作员用户ID
      addOperatorUin: string // 添加操作员唯一ID
    } // 跟踪信息
    c2cDayBackground: string // C2C白天背景
    c2cNightBackground: string // C2C夜间背景
    promptMsg: Uint8Array // 提示消息
    qzoneInfo: {
      updateTipsString: string // 更新提示字符串
      jumpUrl: string // 跳转URL
      hasOpenQQZone: boolean // 是否打开QQ空间
      imageList: string[] // 图片列表
    } // QQ空间信息
    ttsList: {
      defaultTtsId: string // 默认TTS ID
      pickTtsId: string // 选择的TTS ID
      vipVoiceInfo: Uint8Array // VIP语音信息
      ttsList: string[] // TTS 列表
    } // TTS 列表
    inputBox: {
      supportPhoto: number // 支持照片
      supportCamera: number // 支持相机
      supportFile: number // 支持文件
      supportMenu: number // 支持菜单
      supportPanel: number // 支持面板
    } // 输入框支持信息
  }>

  /** 更新群组机器人资料 */
  updateGroupRobotProfile: (groupId: string, profileData: any) => Promise<void>

  /** 设置机器人消息推送 */
  setRobotMessagePush: (robotId: string, push: boolean) => Promise<void>

  /** 将机器人添加到群组 */
  setAddRobotToGroup: (robotId: string, groupId: string) => Promise<void>

  /** 将机器人从群组移除 */
  setRemoveRobotFromGroup: (robotId: string, groupId: string) => Promise<void>

  /** 获取可添加机器人的群组列表 */
  fetchAddRobotGroupList: () => Promise<string[]>

  /** 添加好友 */
  addFriend: (friendId: string) => Promise<void>

  /** 移除好友 */
  removeFriend: (friendId: string) => Promise<void>

  /** 机器人认证 */
  robotAuth: (robotId: string, token: string) => Promise<boolean>

  /** 命令回调 */
  commandCallback: (commandId: string, response: any) => Promise<void>

  /** 获取机器人共享限制 */
  fetchRobotShareLimit: (robotId: string) => Promise<number>

  /** 发送常规机器人到公会 */
  sendCommonRobotToGuild: (robotId: string, guildId: string) => Promise<void>

  /** 获取机器人 UIN 范围 */
  getRobotUinRange: (p1: {
    justFetchMsgConfig: string
    type: number
    version: number
    aioKeywordVersion: number
  }) => WrapperAsyncResponse<{
    response: {
      version: number
      robotUinRanges: { minUin: string, maxUin: string }[]
    }
  }>

  /** 获取群组机器人商店发现 */
  fetchGroupRobotStoreDiscovery: (groupId: string) => Promise<any>

  /** 发送群组机器人商店搜索 */
  sendGroupRobotStoreSearch: (query: string) => Promise<any[]>

  /** 获取群组机器人商店分类列表 */
  fetchGroupRobotStoreCategoryList: () => Promise<string[]>

  /** 获取订阅消息模板 */
  FetchSubscribeMsgTemplate: () => Promise<any>

  /** 获取订阅消息模板状态 */
  FetchSubcribeMsgTemplateStatus: (templateId: string) => Promise<any>

  /** 设置订阅消息模板 */
  SubscribeMsgTemplateSet: (templateId: string, status: boolean) => Promise<void>

  /** 获取最近使用的机器人 */
  fetchRecentUsedRobots: () => Promise<any[]>

  /** 获取共享方舟信息 */
  fetchShareArkInfo: (robotId: string) => Promise<any>

  /** 添加内核机器人监听器 */
  addKernelRobotListener: (listener: KernelRobotListener) => void

  /** 移除内核机器人监听器 */
  removeKernelRobotListener: (listener: KernelRobotListener) => void

  /** 获取缓存中的所有机器人好友 */
  getAllRobotFriendsFromCache: () => Promise<any[]>

  /** 获取推荐的机器人卡片 */
  fetchRecommendRobotCard: () => Promise<any[]>

  /** 获取所有机器人 */
  fetchAllRobots: () => Promise<any[]>

  /** 获取手机机器人推荐卡片 */
  fetchMobileRobotRecommendCards: () => Promise<any[]>

  /** 移除所有推荐缓存 */
  removeAllRecommendCache: () => Promise<void>

  /** 设置机器人选取的 TTS */
  setRobotPickTts: (robotId: string, ttsConfig: any) => Promise<void>

  /** 生成 AI 机器人信息 */
  aiGenBotInfo: (data: any) => Promise<any>

  /** 更换我的机器人 */
  changeMyBot: (newBotId: string) => Promise<void>

  /** 获取 AI 生成的模板信息 */
  fetchAiGenTemplateInfo: (templateId: string) => Promise<any>

  /** 检查我的机器人数量 */
  checkMyBotNum: () => Promise<number>

  /** 生成 AI 头像 */
  aiGenAvatar: (data: any) => Promise<any>

  /** 获取公会机器人附加面板 */
  fetchGuildRobotPlusPanel: (guildId: string) => Promise<any>

  /** 获取公会机器人信息 */
  fetchGuildRobotInfo: (guildId: string) => Promise<any>

  /** 获取机器人常见公会信息 */
  fetchRobotCommonGuild: () => Promise<any>

  /** 获取公会机器人权限 */
  fetchGuildRobotPermission: (guildId: string) => Promise<any>

  /** 设置公会机器人权限 */
  setGuildRobotPermission: (guildId: string, permissions: any) => Promise<void>

  /** 获取公会机器人直接消息设置 */
  fetchGuildRobotDirectMsgSetting: (guildId: string) => Promise<any>

  /** 设置公会机器人直接消息设置 */
  setGuildRobotDirectMsgSetting: (guildId: string, settings: any) => Promise<void>

  /** 添加公会机器人 */
  addGuildRobot: (guildId: string, robotId: string) => Promise<void>

  /** 获取音频直播机器人的状态 */
  getAudioLiveRobotStatus: (robotId: string) => Promise<any>

  /** 订阅公会全局机器人 */
  subscribeGuildGlobalRobot: (guildId: string) => Promise<void>

  /** 查询公会全局机器人订阅 */
  queryGuildGlobalRobotSubscription: (guildId: string) => Promise<any>

  /** 获取公会机器人卡片推荐 */
  getGuildRobotCardRecommend: (guildId: string) => Promise<any>

  /** 获取公会机器人内联搜索 */
  getGuildRobotInlineSearch: (guildId: string, query: string) => Promise<any[]>

  /** 提升公会机器人的麦克风权限 */
  upMicGuildRobot: (guildId: string, robotId: string) => Promise<void>

  /** 降低公会机器人的麦克风权限 */
  downMicGuildRobot: (guildId: string, robotId: string) => Promise<void>

  /** 获取公会机器人的列表 */
  getGuildRobotList: (guildId: string) => Promise<any[]>

  /** 获取群组机器人信息 */
  FetchGroupRobotInfo: (groupId: string) => Promise<any>
}
