import type { ChatType, Element, ElementType, MsgInfo, PeerInfo } from './Element'

/**
 * 消息事件监听器接口，用于处理消息相关的各种事件。
 */
export interface KernelMsgListener {
  /**
   * 接收到消息时触发
   */
  onRecvMsg: (msg: MsgInfo[]) => void

  /**
   * 接收到文件消息时触发
   */
  onFileMsgCome: () => void

  /**
   * 接收到在线文件消息时触发
   */
  onRecvOnlineFileMsg: () => void

  /**
   * 系统消息通知触发
   */
  onSysMsgNotification: () => void

  /**
   * 接收到系统消息时触发(一个字节流)
   */
  onRecvSysMsg: (params: number[]) => boolean

  /**
   * 接收到从服务器到客户端的消息时触发
   */
  onRecvS2CMsg: () => void

  /**
   * 在线设备信息触发
   */
  onLineDev: () => void

  /**
   * 被踢下线时触发
   */
  onKickedOffLine: () => void

  /**
   * 消息设置更新时触发
   */
  onMsgSettingUpdate: () => void

  /**
   * 添加发送的消息时触发
   */
  onAddSendMsg: () => void

  /**
   * 消息撤回时触发
   */
  onMsgRecall: () => void

  /**
   * 发送消息出错时触发
   */
  onSendMsgError: () => void

  /**
   * 接收到消息服务器响应传输信息时触发
   */
  onRecvMsgSvrRspTransInfo: () => void

  /**
   * 消息信息列表更新时触发(不是很确认)
   */
  onMsgInfoListUpdate: (msg: MsgInfo[]) => boolean

  /**
   * 消息信息列表添加时触发
   */
  onMsgInfoListAdd: () => void

  /**
   * 消息安全通知时触发
   */
  onMsgSecurityNotify: () => void

  /**
   * 删除消息时触发
   */
  onMsgDelete: () => void

  /**
   * 消息事件列表更新时触发
   */
  onMsgEventListUpdate: () => void

  /**
   * 自定义撤回配置更新时触发
   */
  onCustomWithdrawConfigUpdate: () => void

  /**
   * 通道频率限制信息更新时触发
   */
  onChannelFreqLimitInfoUpdate: () => void

  /**
   * 未读消息计数更新时触发
   */
  onUnreadCntUpdate: () => void

  /**
   * 首次查看后未读消息计数更新时触发
   */
  onUnreadCntAfterFirstView: () => void

  /**
   * 联系人未读消息计数更新时触发
   */
  onContactUnreadCntUpdate: (
    params: Map<
      number,
      Map<
        string,
        {
          show_unread_cnt: {
            type: number
            cnt: number
          }
          all_unread_cnt: {
            type: number
            cnt: number
          }
          atme_unread_cnt: {
            type: number
            cnt: number
          }
          atall_unread_cnt: {
            type: number
            cnt: number
          }
          peer: PeerInfo
          related_to_me_string: string
          related_to_me_cnt: number
          last_related_to_me_type: number
          related_to_me_string_time: string
          last_related_to_feed_type: number
          header_url: Uint8Array
        }
      >
    >
  ) => boolean

  /**
   * 消息摘要更新时触发
   */
  onMsgAbstractUpdate: (
    params: {
      peer: PeerInfo
      senderUid: string
      sendMemberName: string
      sendNickName: string
      sendStatus: number
      elements: [
        {
          elementType: 1
          elementSubType: null
          content: string
          custom_content: null
          index: null
          isSetProclamation: null
          isSetEssence: null
          operatorRole: null
          operatorTinyId: null
          fileName: null
          tinyId: null
          msgSeq: null
          msgId: null
          emojiId: null
          emojiType: null
          localGrayTipType: null
          grayTiPElement: null
          textGiftElement: null
          calendarElement: null
          channelStateElement: null
          onlineFileMsgCnt: null
        },
      ]
      abstractTime: string
      msgType: number
      msgSeq: string
    }[]
  ) => boolean

  /**
   * 草稿更新时触发
   */
  onDraftUpdate: () => void

  /**
   * 富媒体上传完成时触发
   */
  onRichMediaUploadComplete: () => void

  /**
   * 富媒体下载完成时触发
   */
  onRichMediaDownloadComplete: (params: {
    fileModelId: string
    msgElementId: string
    msgId: string
    fileId: string
    fileProgress: string
    fileSpeed: string
    fileErrCode: string
    fileErrMsg: string
    fileDownType: number
    thumbSize: number
    filePath: string
    totalSize: string
    trasferStatus: number
    step: number
    commonFileInfo: {
      fileModelId: string
      msgId: string
      elemId: string
      uuid: string
      subId: string
      fileName: string
      fileSize: string
      msgTime: string
      peerUid: string
      chatType: ChatType
      md5: string
      md510m: string
      sha: string
      sha3: string
      parent: null
      favId: null
      bizType: null
      picThumbPath: null
    }
    fileSrvErrCode: string
    clientMsg: string
    businessId: number
    userTotalSpacePerDay: null
    userUsedSpacePerDay: null
    msgRecord: null
    chatType: null
  }) => boolean

  /**
   * 富媒体进度更新时触发
   */
  onRichMediaProgerssUpdate: () => void

  /**
   * 群组文件信息更新时触发
   */
  onGroupFileInfoUpdate: () => void

  /**
   * 搜索群组文件信息更新时触发
   */
  onSearchGroupFileInfoUpdate: () => void

  /**
   * 群组转账信息更新时触发
   */
  onGroupTransferInfoUpdate: () => void

  /**
   * 群组文件信息添加时触发
   */
  onGroupFileInfoAdd: () => void

  /**
   * 群组转账信息添加时触发
   */
  onGroupTransferInfoAdd: () => void

  /**
   * 表情下载完成时触发
   */
  onEmojiDownloadComplete: (params: {
    result: number
    errMsg: string
    emojiType: number
    md5: string
    resId: string
    path: string
    extraData: Map<unknown, unknown>
    emojiId: string
    emojiPackageId: string
    downloadType: number
    dynamicFacePath: string
  }) => boolean

  /**
   * 表情资源更新时触发
   */
  onEmojiResourceUpdate: () => void

  /**
   * 消息同步开始时触发
   */
  onNtMsgSyncStart: () => void

  /**
   * 首次查看消息同步结束时触发
   */
  onNtFirstViewMsgSyncEnd: () => void

  /**
   * 消息同步结束时触发
   */
  onNtMsgSyncEnd: () => void

  /**
   * 广播助手下载完成时触发
   */
  onBroadcastHelperDownloadComplete: () => void

  /**
   * 广播助手进度更新时触发
   */
  onBroadcastHelperProgerssUpdate: () => void

  /**
   * 输入状态推送时触发
   */
  onInputStatusPush: () => void

  /**
   * 导入旧数据库进度更新时触发
   */
  onImportOldDbProgressUpdate: () => void

  /**
   * 消息二维码状态变化时触发
   */
  onMsgQRCodeStatusChanged: () => void

  /**
   * 在线状态小图标下载推送时触发
   */
  onlineStatusSmallIconDownloadPush: () => void

  /**
   * 首次查看群组公会映射时触发
   */
  onFirstViewGroupGuildMapping: () => void

  /**
   * 在线状态大图标下载推送时触发
   */
  onlineStatusBigIconDownloadPush: () => void

  /**
   * 首次查看直接消息更新时触发
   */
  onFirstViewDirectMsgUpdate: () => void

  /**
   * 事件更新时触发
   */
  onFeedEventUpdate: () => void

  /**
   * 公会交互更新时触发
   */
  onGuildInteractiveUpdate: () => void

  /**
   * 公会顶部动态更新时触发
   */
  onGuildTopFeedUpdate: () => void

  /**
   * 公会通知摘要更新时触发
   */
  onGuildNotificationAbstractUpdate: () => void

  /**
   * 已读动态事件更新时触发
   */
  onReadFeedEventUpdate: () => void

  /**
   * 临时聊天信息更新时触发
   */
  onTempChatInfoUpdate: () => void

  /**
   * 用户在线状态变化时触发
   */
  onUserOnlineStatusChanged: () => void

  /**
   * 命中表情关键字结果时触发
   */
  onHitEmojiKeywordResult: () => void

  /**
   * 命中相关表情结果时触发
   */
  onHitRelatedEmojiResult: () => void

  /**
   * 命中客服相关表情结果时触发
   */
  onHitCsRelatedEmojiResult: () => void

  /**
   * 用户标签状态变化时触发
   */
  onUserTabStatusChanged: () => void

  /**
   * 消息框变化时触发
   */
  onMsgBoxChanged: () => void

  /**
   * 日志级别变化时触发
   */
  onLogLevelChanged: () => void

  /**
   * 用户频道标签状态变化时触发
   */
  onUserChannelTabStatusChanged: () => void

  /**
   * 群组公会更新时触发
   */
  onGroupGuildUpdate: () => void

  /**
   * 抢红包密码时触发
   */
  onGrabPasswordRedBag: () => void

  /**
   * 红点变化时触发
   */
  onRedTouchChanged: () => void

  /**
   * 接收到 UDC 标志时触发
   */
  onRecvUDCFlag: () => void

  /**
   * 接收到群组公会标志时触发
   */
  onRecvGroupGuildFlag: () => void

  /**
   * 用户安全质量变化时触发
   */
  onUserSecQualityChanged: () => void

  /**
   * 带富链接信息的消息更新时触发
   */
  onMsgWithRichLinkInfoUpdate: () => void

  /**
   * 公会消息 AB 标志变化时触发
   */
  onGuildMsgAbFlagChanged: () => void
}

export interface NodeIKernelMsgService {
  addKernelMsgListener: (listener: KernelMsgListener) => void // 添加内核消息监听器
  addKernelMsgImportToolListener: (listener: unknown) => void // 添加内核消息导入工具监听器
  removeKernelMsgListener: (listener: KernelMsgListener) => void // 移除内核消息监听器
  addKernelTempChatSigListener: (listener: unknown) => void // 添加临时聊天信号监听器
  removeKernelTempChatSigListener: (listener: unknown) => void // 移除临时聊天信号监听器
  setAutoReplyTextList: (textList: string[]) => void // 设置自动回复文本列表
  getAutoReplyTextList: () => string[] // 获取自动回复文本列表
  getOnLineDev: () => any // 获取在线开发信息
  kickOffLine: () => void // 强制下线
  setStatus: (status: string) => void // 设置状态
  fetchStatusMgrInfo: () => any // 获取状态管理信息
  fetchStatusUnitedConfigInfo: () => any // 获取状态联合配置
  getOnlineStatusSmallIconBasePath: () => string // 获取在线状态小图标基本路径
  getOnlineStatusSmallIconFileNameByUrl: (url: string) => string // 根据URL获取在线状态小图标文件名
  downloadOnlineStatusSmallIconByUrl: (url: string) => Promise<void> // 根据URL下载在线状态小图标
  getOnlineStatusBigIconBasePath: () => string // 获取在线状态大图标基本路径
  downloadOnlineStatusBigIconByUrl: (url: string) => Promise<void> // 根据URL下载在线状态大图标
  getOnlineStatusCommonPath: () => string // 获取在线状态公共路径
  getOnlineStatusCommonFileNameByUrl: (url: string) => string // 根据URL获取在线状态公共文件名
  downloadOnlineStatusCommonByUrl: (url: string) => Promise<void> // 根据URL下载在线状态公共文件
  setToken: (token: string) => void // 设置令牌
  switchForeGround: () => void // 切换到前台
  switchBackGround: () => void // 切换到后台
  setTokenForMqq: (token: string) => void // 为MQQ设置令牌
  switchForeGroundForMqq: () => void // 为MQQ切换到前台
  switchBackGroundForMqq: () => void // 为MQQ切换到后台
  getMsgSetting: () => any // 获取消息设置
  setMsgSetting: (setting: any) => void // 设置消息设置
  sendMsg: (
    msgId: string,
    peerInfo: PeerInfo,
    elements: Omit<Element, 'elementGroupId' | 'extBufForUI'>[],
    map: Map<unknown, unknown>
  ) => WrapperAsyncResponse // 发送消息
  addSendMsg: (msg: string) => void // 添加待发送消息
  cancelSendMsg: (msgId: string) => void // 取消发送消息
  switchToOfflineSendMsg: () => void // 切换为离线发送消息
  reqToOfflineSendMsg: () => void // 请求离线发送消息
  refuseReceiveOnlineFileMsg: () => void // 拒绝接收在线文件消息
  resendMsg: (msgId: string) => void // 重发消息
  stopGenerateMsg: () => void // 停止生成消息
  regenerateMsg: (msgId: string) => void // 重新生成消息
  recallMsg: (msgId: string) => void // 撤回消息
  recallMsgs: (msgIds: string[]) => void // 撤回多条消息
  reeditRecallMsg: (msgId: string) => void // 重新编辑撤回消息
  forwardMsg: (msgId: string, targetId: string) => void // 转发消息
  forwardMsgWithComment: (
    msgId: string[],
    peerInfo: PeerInfo,
    target: PeerInfo[]
  ) => WrapperAsyncResponse<{
    detailErr: Map<unknown, unknown>
  }> // 带评论转发消息
  forwardSubMsgWithComment: (msgId: string, targetId: string, comment: string) => void // 带评论转发子消息
  forwardRichMsgInVist: (msgId: string, targetId: string) => void // 在Vist中转发富文本消息
  forwardFile: (fileId: string, targetId: string) => void // 转发文件
  multiForwardMsg: (msgIds: string[], targetId: string) => void // 多条消息转发
  multiForwardMsgWithComment: (msgIds: string[], targetId: string, comment: string) => void // 带评论多条消息转发
  deleteRecallMsg: (msgId: string) => void // 删除撤回的消息
  deleteRecallMsgForLocal: (msgId: string) => void // 为本地删除撤回的消息
  addLocalGrayTipMsg: (msg: string) => void // 添加本地灰色提示消息
  addLocalJsonGrayTipMsg: (jsonMsg: object) => void // 添加本地JSON格式灰色提示消息
  addLocalJsonGrayTipMsgExt: (jsonMsg: object) => void // 添加本地扩展的JSON格式灰色提示消息
  IsLocalJsonTipValid: (jsonMsg: object) => boolean // 检查本地JSON提示消息是否有效
  addLocalAVRecordMsg: (msg: any) => void // 添加本地音视频记录消息
  addLocalTofuRecordMsg: (msg: any) => void // 添加本地Tofu记录消息
  addLocalRecordMsg: (msg: any) => void // 添加本地记录消息
  addLocalRecordMsgWithExtInfos: (msg: any, extInfos: any) => void // 添加带扩展信息的本地记录消息
  deleteMsg: (msgId: string) => void // 删除消息
  updateElementExtBufForUI: (msgId: string, buf: any) => void // 更新UI消息元素扩展缓冲
  updateMsgRecordExtPbBufForUI: (msgId: string, buf: any) => void // 更新UI消息记录扩展protobuf缓冲
  startMsgSync: () => void // 开始消息同步
  startGuildMsgSync: () => void // 开始公会消息同步
  isGuildChannelSync: () => boolean // 判断是否为公会频道同步
  generateMsgUniqueId: () => string // 生成消息唯一ID
  isMsgMatched: (msgId: string) => boolean // 判断消息是否匹配
  getOnlineFileMsgs: () => any[] // 获取在线文件消息
  getAllOnlineFileMsgs: () => any[] // 获取所有在线文件消息
  getLatestDbMsgs: () => any[] // 获取最新数据库消息
  getLastMessageList: () => any[] // 获取最后消息列表
  // 获取首次查看的最新消息
  getAioFirstViewLatestMsgs: () => WrapperAsyncResponse<{
    msgList: MsgInfo[]
  }>
  getMsgs: (filter: any) => any[] // 获取消息
  /**
   * 获取消息的详情数据，似乎所有消息出现在视口时都会请求一次(只针对最新消息？)
   */
  getMsgsIncludeSelf: (peerInfo: PeerInfo, msgId: string, p1: number, p2: boolean) => WrapperAsyncResponse<{
    msgList: MsgInfo[]
  }>
  getMsgsWithMsgTimeAndClientSeqForC2C: () => any[] // 获取C2C消息及其时间和客户端序列
  getMsgsWithStatus: (status: any) => any[] // 获取特定状态的消息
  getMsgsBySeqRange: (startSeq: number, endSeq: number) => any[] // 根据序列范围获取消息
  getMsgsBySeqAndCount: (seq: number, count: number) => any[] // 根据序列和数量获取消息
  getMsgsByMsgId: (msgId: string) => any // 根据消息ID获取消息
  getRecallMsgsByMsgId: (msgId: string) => any[] // 根据消息ID获取撤回的消息
  getMsgsBySeqList: (seqList: number[]) => any[] // 根据序列列表获取消息
  getMsgsExt: (msgId: string) => any // 获取消息的扩展信息
  getSingleMsg: (msgId: string) => any // 获取单条消息
  getSourceOfReplyMsg: (msgId: string) => any // 获取回复消息的来源
  getSourceOfReplyMsgV2: (msgId: string) => any // 获取回复消息的来源（V2版本）
  getMsgByClientSeqAndTime: (clientSeq: number, time: number) => any // 根据客户端序列和时间获取消息
  getSourceOfReplyMsgByClientSeqAndTime: (clientSeq: number, time: number) => any // 根据客户端序列和时间获取回复消息的来源
  getMsgsByTypeFilter: (type: string) => any[] // 根据类型过滤获取消息
  getMsgsByTypeFilters: (types: string[]) => any[] // 根据类型过滤获取多条消息
  getMsgWithAbstractByFilterParam: (param: any) => any // 根据过滤参数获取消息摘要
  queryMsgsWithFilter: (filter: any) => any[] // 根据过滤条件查询消息
  queryMsgsWithFilterVer2: (filter: any) => any[] // 根据过滤条件查询消息（V2版本）
  queryMsgsWithFilterEx: (filter: any) => any[] // 根据扩展过滤条件查询消息
  queryFileMsgsDesktop: () => any[] // 查询桌面文件消息
  setMsgRichInfoFlag: (msgId: string, flag: boolean) => void // 设置消息富信息标志
  queryPicOrVideoMsgs: () => any[] // 查询图片或视频消息
  queryPicOrVideoMsgsDesktop: () => any[] // 查询桌面图片或视频消息
  queryEmoticonMsgs: () => any[] // 查询表情消息
  queryTroopEmoticonMsgs: () => any[] // 查询群组表情消息
  queryMsgsAndAbstractsWithFilter: (filter: any) => any[] // 根据过滤条件查询消息及其摘要
  setFocusOnGuild: (guildId: string) => void // 设置关注公会
  setFocusSession: (sessionId: string) => void // 设置关注会话
  enableFilterUnreadInfoNotify: () => void // 启用未读信息通知过滤
  enableFilterMsgAbstractNotify: () => void // 启用消息摘要通知过滤
  onScenesChangeForSilenceMode: (silenceMode: boolean) => void // 场景变更时处理静音模式
  getContactUnreadCnt: (contactId: string) => number // 获取联系人未读消息数量
  getUnreadCntInfo: () => any // 获取未读消息数量信息
  getGuildUnreadCntInfo: () => any // 获取公会未读消息数量信息
  getGuildUnreadCntTabInfo: () => any // 获取公会未读消息数量标签信息
  getGuildChannelListUnreadInfo: () => any // 获取公会频道列表未读信息
  getAllGuildUnreadCntInfo: () => any // 获取所有公会未读消息数量信息
  getAllJoinGuildCnt: () => number // 获取所有加入公会的数量
  getAllDirectSessionUnreadCntInfo: () => WrapperAsyncResponse<{
    show_unread_cnt: {
      type: number
      cnt: number
    }
    all_unread_cnt: {
      type: number
      cnt: number
    }
    atme_unread_cnt: {
      type: number
      cnt: number
    }
    atall_unread_cnt: {
      type: number
      cnt: number
    }
    peer: PeerInfo
    related_to_me_string: string
    related_to_me_cnt: number
    last_related_to_me_type: number
    related_to_me_string_time: string
    last_related_to_feed_type: number
    header_url: Uint8Array
  }> // 获取所有直接会话未读数量信息
  getCategoryUnreadCntInfo: () => any // 获取类别未读数量信息
  getGuildFeedsUnreadCntInfo: () => any // 获取公会信息未读数量信息
  setUnVisibleChannelCntInfo: (info: any) => void // 设置不可见频道计数信息
  setUnVisibleChannelTypeCntInfo: (info: any) => void // 设置不可见频道类型计数信息
  setVisibleGuildCntInfo: (info: any) => void // 设置可见公会计数信息
  setMsgRead: (peerInfo: PeerInfo) => WrapperAsyncResponse // 设置消息为已读
  setAllC2CAndGroupMsgRead: () => void // 设置所有C2C和群组消息为已读
  setGuildMsgRead: (guildId: string) => void // 设置公会消息为已读
  setAllGuildMsgRead: () => void // 设置所有公会消息为已读
  setAllDirectMsgRead: () => void // 设置所有直接消息为已读
  setMsgReadAndReport: (msgId: string) => void // 设置消息为已读并报告
  setSpecificMsgReadAndReport: (msgId: string) => void // 设置特定消息为已读并报告
  setLocalMsgRead: (peerInfo: PeerInfo) => WrapperAsyncResponse // 设置本地消息为已读
  setGroupGuildMsgRead: (groupId: string) => void // 设置群组公会消息为已读
  getGuildGroupTransData: () => any // 获取公会群组转换数据
  setGroupGuildBubbleRead: (groupId: string) => void // 设置群组公会气泡为已读
  getGuildGroupBubble: (groupId: string) => any // 获取群组公会气泡信息
  fetchGroupGuildUnread: () => any // 获取群组公会未读信息
  setGroupGuildFlag: (groupId: string, flag: boolean) => void // 设置群组公会标志
  setGuildUDCFlag: (guildId: string, flag: boolean) => void // 设置公会UDC标志
  setGuildTabUserFlag: (userId: string, flag: boolean) => void // 设置公会标签用户标志
  setBuildMode: (mode: string) => void // 设置构建模式
  setConfigurationServiceData: (data: any) => void // 设置配置服务数据
  setMarkUnreadFlag: (flag: boolean) => void // 设置标记未读标志
  getChannelEventFlow: () => any // 获取频道事件流
  getMsgEventFlow: () => any // 获取消息事件流
  getRichMediaFilePathForMobileQQSend: (fileId: string) => string // 获取移动QQ发送的富媒体文件路径
  getRichMediaFilePathForGuild: (params: {
    md5HexStr: string
    fileName: string
    elementType: ElementType
    elementSubType: number
    thumbSize: number
    needCreate: true
    downloadType: number
    file_uuid: string
  }) => string // 获取公会的富媒体文件路径
  assembleMobileQQRichMediaFilePath: (fileId: string) => string // 组装移动QQ富媒体文件路径
  getFileThumbSavePathForSend: (fileId: string) => string // 获取发送文件缩略图保存路径
  getFileThumbSavePath: (fileId: string) => string // 获取文件缩略图保存路径
  copyFileWithDelExifInfo: (fileId: string) => void // 复制文件并删除Exif信息
  translatePtt2Text: (pttFileId: string) => string // 将Ptt文件翻译为文本
  setPttPlayedState: (pttFileId: string, state: boolean) => void // 设置Ptt播放状态
  fetchFavEmojiList: () => WrapperAsyncResponse<{
    emojiInfoList: {
      /**
       * QQ 账号唯一标识（用户ID）
       * 示例：'642886174'
       */
      uin: string

      /**
       * 表情唯一ID（用于本地索引）
       * 示例：13
       */
      emoId: number

      /**
       * 表情原图本地存储路径（绝对路径）
       * 格式：Windows 系统路径，jpg 格式
       */
      emoPath: string

      /**
       * 表情原图是否在本地存在
       * true: 本地有该表情文件；false: 文件丢失或未下载
       */
      isExist: boolean

      /**
       * 表情缩略图是否在本地存在
       * true: 本地有缩略图文件；false: 缩略图丢失或未生成
       */
      isThumbExist: boolean

      /**
       * 表情资源唯一标识（用于网络请求）
       * 格式：{uin}_{参数1}_{参数2}_{参数3}_{md5}_{参数4}_{参数5}
       */
      resId: string

      /**
       * 表情网络图片URL（可直接访问）
       * 域名：p.qpic.cn（QQ 官方图片服务器）
       */
      url: string

      /**
       * 表情文件的MD5值（用于校验文件完整性）
       * 作用：判断本地文件与服务器文件是否一致
       */
      md5: string

      /**
       * 表情原始文件路径（预留字段，当前未使用）
       * 说明：可能用于记录表情最初的来源路径，目前为空字符串
       */
      emoOriginalPath: string

      /**
       * 表情缩略图本地存储路径（绝对路径）
       * 格式：Windows 系统路径，png 格式（缩略图常用格式）
       */
      thumbPath: string

      /**
       * 漫游类型（预留字段，当前未使用）
       * 说明：可能用于区分表情的漫游状态（如普通漫游、会员漫游等），目前为空字符串
       */
      RomaingType: string

      /**
       * 是否为APNG格式（动态表情格式）
       * false: 静态表情（如jpg/png）；true: 动态表情（如apng/gif）
       */
      isAPNG: boolean

      /**
       * 是否标记人脸（表情中是否包含人脸标注信息）
       * false: 无脸标注；true: 有脸标注（可能用于表情搜索等功能）
       */
      isMarkFace: boolean

      /**
       * 表情扩展ID（预留字段，当前未使用）
       * 说明：可能用于后续扩展表情的额外标识，目前为空字符串
       */
      eId: string

      /**
       * 表情包扩展ID（预留字段，当前固定为'0'）
       * 说明：可能用于关联表情所属的表情包，目前默认值为'0'
       */
      epId: string

      /**
       * OCR识别文本（表情中的文字内容识别结果）
       * 说明：若表情包含文字，会存储识别后的文本；无文字则为空字符串
       */
      ocrWord: string

      /**
       * 修改后的OCR文本（预留字段，当前未使用）
       * 说明：可能用于手动修改OCR识别错误的文本，目前为空字符串
       */
      modifyWord: string

      /**
       * 表情曝光次数（被查看的次数）
       * 统计维度：可能包括在表情面板中被展示的次数
       */
      exposeNum: number

      /**
       * 表情点击次数（被使用的次数）
       * 统计维度：用户点击该表情发送的次数，示例值为9
       */
      clickNum: number

      /**
       * 表情描述（用户对表情的备注或系统描述）
       * 说明：用于记录表情的文字说明，目前为空字符串
       */
      desc: string
    }[]
  }> // 获取收藏表情列表
  addFavEmoji: (emoji: any) => void // 添加收藏表情
  fetchMarketEmoticonList: () => any[] // 获取市场表情列表
  delMarketEmojiTab: (tabId: string) => void // 删除市场表情标签
  fetchBottomEmojiTableList: () => any[] // 获取底部表情表列表
  moveBottomEmojiTable: (oldIndex: number, newIndex: number) => void // 移动底部表情表
  modifyBottomEmojiTableSwitchStatus: (status: boolean) => void // 修改底部表情表开关状态
  fetchMarketEmoticonShowImage: (emojiId: string) => string // 获取市场表情显示图
  fetchMarketEmoticonAioImage: (params: {
    eId: string
    epId: number
    name: string
    width: number
    height: number
    jobType: number
    encryptKey: string
    filePath: string
    downloadType: number
  }) => WrapperAsyncResponse // 获取市场表情AIO图
  fetchMarketEmotionJsonFile: (emojiId: string) => any // 获取市场表情JSON文件
  getMarketEmoticonPath: (emojiId: string) => string // 获取市场表情路径
  getMarketEmoticonPathBySync: (emojiId: string) => string // 通过同步获取市场表情路径
  fetchMarketEmoticonFaceImages: (emojiId: string) => any[] // 获取市场表情脸部图像
  fetchMarketEmoticonAuthDetail: (emojiId: string) => any // 获取市场表情授权详情
  getFavMarketEmoticonInfo: (emojiId: string) => any // 获取收藏市场表情信息
  addRecentUsedFace: (faceId: string) => void // 添加最近使用的表情
  getRecentUsedFaceList: () => any[] // 获取最近使用的表情列表
  getMarketEmoticonEncryptKeys: () => any // 获取市场表情加密密钥
  downloadEmojiPic: (emojiId: string, p2: [], p3: number, p4: Map<unknown, unknown>) => void // 下载表情图片
  deleteFavEmoji: (emojiId: string) => void // 删除收藏表情
  modifyFavEmojiDesc: (emojiId: string, desc: string) => void // 修改收藏表情描述
  queryFavEmojiByDesc: (desc: string) => any[] // 根据描述查询收藏表情
  getHotPicInfoListSearchString: (searchString: string) => any[] // 获取热门图片信息列表搜索字符串
  getHotPicSearchResult: (searchString: string) => any[] // 获取热门图片搜索结果
  getHotPicHotWords: () => any[] // 获取热门图片热词
  getHotPicJumpInfo: () => any // 获取热门图片跳转信息
  getEmojiResourcePath: (emojiId: string) => string // 获取表情资源路径
  JoinDragonGroupEmoji: (emojiId: string) => void // 加入龙组表情
  getMsgAbstracts: () => any[] // 获取消息摘要
  getMsgAbstract: (msgId: string) => any // 获取单条消息摘要
  getMsgAbstractList: () => any[] // 获取消息摘要列表
  getMsgAbstractListBySeqRange: (startSeq: number, endSeq: number) => any[] // 根据序列范围获取消息摘要列表
  refreshMsgAbstracts: () => void // 刷新消息摘要
  refreshMsgAbstractsByGuildIds: (guildIds: string[]) => void // 根据公会ID刷新消息摘要
  getRichMediaElement: (msgId: string) => any // 获取富媒体元素
  cancelGetRichMediaElement: (msgId: string) => void // 取消获取富媒体元素
  refuseGetRichMediaElement: (msgId: string) => void // 拒绝获取富媒体元素
  switchToOfflineGetRichMediaElement: () => void // 切换为离线获取富媒体元素
  downloadRichMedia: (params: {
    fileModelId: string
    downSourceType: number
    triggerType: number
    msgId: string
    chatType: ChatType
    peerUid: string
    elementId: string
    thumbSize: number
    downloadType: number
    filePath: string
  }) => void // 下载富媒体
  getFirstUnreadMsgSeq: (params: PeerInfo) => WrapperAsyncResponse<{ seq: string }> // 获取首个未读消息序列
  getFirstUnreadCommonMsg: () => any // 获取首个未读普通消息
  getFirstUnreadAtmeMsg: () => any // 获取首个未读@我的消息
  getFirstUnreadAtallMsg: () => any // 获取首个未读@所有人的消息
  getNavigateInfo: () => any // 获取导航信息
  getChannelFreqLimitInfo: () => any // 获取频道频率限制信息
  getRecentUseEmojiList: () => any[] // 获取最近使用的表情列表
  getRecentEmojiList: (params: number) => WrapperAsyncResponse<{
    emojiInfoList: {
      updateTime: string
      usedCount: number
      emojiType: number
      emojiId: string
    }[]
  }> // 获取最近表情列表
  setMsgEmojiLikes: (
    peerInfo: PeerInfo,
    msgId: string,
    emojiId: string,
    emojiCount: string,
    isLiked: boolean
  ) => WrapperAsyncResponse // 设置消息表情点赞数
  getMsgEmojiLikesList: (msgId: string) => any[] // 获取消息表情点赞列表
  setMsgEmojiLikesForRole: (msgId: string, role: string, likes: number) => void // 设置角色的消息表情点赞数
  clickInlineKeyboardButton: (buttonId: string) => void // 点击内联键盘按钮
  setCurOnScreenMsg: (msgId: string) => void // 设置当前屏幕消息
  setCurOnScreenMsgForMsgEvent: (peerInfo: PeerInfo, p2: Map<string, Uint8Array>) => void // 为消息事件设置当前屏幕消息
  getMiscData: (string: string) => WrapperAsyncResponse // 获取杂项数据
  setMiscData: (data: any) => void // 设置杂项数据
  getBookmarkData: () => any // 获取书签数据
  setBookmarkData: (data: any) => void // 设置书签数据
  sendShowInputStatusReq: () => void // 发送显示输入状态请求
  queryCalendar: () => any // 查询日历
  queryFirstMsgSeq: () => number // 查询首条消息序列
  queryRoamCalendar: () => any // 查询漫游日历
  queryFirstRoamMsg: () => any // 查询首条漫游消息
  fetchLongMsg: () => any // 获取长消息
  fetchLongMsgWithCb: (callback: (msg: any) => void) => void // 通过回调获取长消息
  setIsStopKernelFetchLongMsg: (stop: boolean) => void // 设置是否停止内核获取长消息
  insertGameResultAsMsgToDb: (result: any) => void // 将游戏结果作为消息插入数据库
  getMultiMsg: () => any[] // 获取多条消息
  setDraft: (draft: any) => void // 设置草稿
  getDraft: (params: PeerInfo) => WrapperAsyncResponse<{
    msgElements: []
    draftTime: string
  }> // 获取草稿
  deleteDraft: (draftId: string) => void // 删除草稿
  getRecentHiddenSesionList: () => any[] // 获取最近隐藏的会话列表
  setRecentHiddenSession: (sessionId: string) => void // 设置最近隐藏的会话
  delRecentHiddenSession: (sessionId: string) => void // 删除最近隐藏的会话
  getCurHiddenSession: () => any // 获取当前隐藏会话
  setCurHiddenSession: (sessionId: string) => void // 设置当前隐藏会话
  setReplyDraft: (draft: any) => void // 设置回复草稿
  getReplyDraft: () => any // 获取回复草稿
  deleteReplyDraft: (draftId: string) => void // 删除回复草稿
  getFirstUnreadAtMsg: () => any // 获取首个未读@我的消息
  clearMsgRecords: () => void // 清除消息记录
  IsExistOldDb: () => boolean // 是否存在旧数据库
  canImportOldDbMsg: () => boolean // 是否可以导入旧数据库消息
  getOldMsgDbInfo: () => any // 获取旧消息数据库信息
  stopImportOldDbMsg: () => void // 停止导入旧数据库消息
  setPowerStatus: (status: boolean) => void // 设置电源状态
  canProcessDataMigration: () => boolean // 是否可以处理数据迁移
  importOldDbMsg: () => void // 导入旧数据库消息
  stopImportOldDbMsgAndroid: () => void // 停止导入旧数据库消息（Android）
  isMqqDataImportFinished: () => boolean // MQQ数据导入是否完成
  getMqqDataImportTableNames: () => string[] // 获取MQQ数据导入表名
  getCurChatImportStatusByUin: (uin: string) => any // 根据Uin获取当前聊天导入状态
  getDataImportUserLevel: () => any // 获取数据导入用户级别
  importDataLineMsg: (data: any) => void // 导入数据行消息
  getMsgQRCode: (msgId: string) => string // 获取消息二维码
  getGuestMsgAbstracts: () => any[] // 获取游客消息摘要
  getGuestMsgByRange: (start: number, end: number) => any[] // 根据范围获取游客消息
  getGuestMsgAbstractByRange: (start: number, end: number) => any[] // 根据范围获取游客消息摘要
  registerSysMsgNotification: (callback: (msg: any) => void) => void // 注册系统消息通知
  unregisterSysMsgNotification: () => void // 注销系统消息通知
  sendSsoCmdReqByContend: (cmd: string) => void // 发送SSO命令请求
  enterOrExitAio: (
    params: {
      peer: PeerInfo
      option: number
    }[]
  ) => WrapperAsyncResponse // 进入或退出AIO模式
  prepareTempChat: () => void // 准备临时聊天
  getTempChatInfo: () => any // 获取临时聊天信息
  setContactLocalTop: (contactId: string) => void // 设置联系人置顶
  switchAnonymousChat: (enable: boolean) => void // 切换匿名聊天
  renameAnonyChatNick: (nick: string) => void // 重命名匿名聊天昵称
  getAnonymousInfo: () => any // 获取匿名信息
  updateAnonymousInfo: (info: any) => void // 更新匿名信息
  sendSummonMsg: (msg: any) => void // 发送召唤消息
  outputGuildUnreadInfo: () => any // 输出公会未读信息
  checkMsgWithUrl: (urls: {
    urls: string[]
  }) => WrapperAsyncResponse<{ checkUrlsResult: {
    url: string
    result: number
    jumpResult: number
    jumpUrl: string
  }[] }> // 检查消息中的URL
  checkTabListStatus: () => WrapperAsyncResponse // 检查标签列表状态
  getABatchOfContactMsgBoxInfo: (params: PeerInfo[]) => WrapperAsyncResponse<{
    contactMsgBoxInfos: {
      contact: PeerInfo
      firstUnreadMsgInfo: { msgSeq: string, msgTime: string, highlightDigest: string }
      unreadCnt: string
      listOfSpecificEventTypeInfosInMsgBox: unknown[]
    }[]
  }> // 获取批次联系人消息盒子信息
  insertMsgToMsgBox: (msg: any) => void // 插入消息到消息盒子
  isHitEmojiKeyword: (keyword: string) => boolean // 是否命中表情关键字
  getKeyWordRelatedEmoji: (keyword: string) => any[] // 获取与关键字相关的表情
  recordEmoji: (emoji: any) => void // 记录表情
  fetchGetHitEmotionsByWord: (word: string) => any[] // 根据单词获取命中表情
  deleteAllRoamMsgs: () => void // 删除所有漫游消息
  packRedBag: (bagInfo: any) => void // 打包红包
  grabRedBag: (params: {
    // 领取人Q号 & 群号
    recvUin: string
    // 领取人 Uid & 群号
    peerUid: string
    // 消息来源
    recvType: number
    // 领取人名字
    name: string

    // 原始参数
    pcBody: string
    msgSeq: string
    index: string
    // 红包标题
    wishing: string
  }) => WrapperAsyncResponse<{
    grabRedBagRsp: {
      result: number
      recvdOrder: {
        recvUin: string
        recvName: string
        amount: string
        createTime: number
        uid: null
      }
    }
  }> // 抢红包
  pullDetail: (bagId: string) => any // 拉取红包详情
  selectPasswordRedBag: (bagId: string) => void // 选择密码红包
  pullRedBagPasswordList: (bagId: string) => any[] // 拉取红包密码列表
  requestTianshuAdv: () => void // 请求天书广告
  tianshuReport: (data: any) => void // 天书报告
  tianshuMultiReport: (data: any) => void // 天书多重报告
  GetMsgSubType: (msgId: string) => any // 获取消息子类型
  setIKernelPublicAccountAdapter: (adapter: any) => void // 设置内核公共账号适配器
  createUidFromTinyId: (tinyId: string) => string // 从Tiny ID创建UID
  dataMigrationGetDataAvaiableContactList: () => any[] // 数据迁移获取可用联系人列表
  dataMigrationGetMsgList: () => any[] // 数据迁移获取消息列表
  dataMigrationStopOperation: () => void // 停止数据迁移操作
  dataMigrationImportMsgPbRecord: (record: any) => void // 数据迁移导入消息PB记录
  dataMigrationGetResourceLocalDestinyPath: () => string // 数据迁移获取资源本地目标路径
  dataMigrationSetIOSPathPrefix: (prefix: string) => void // 数据迁移设置IOS路径前缀
  getServiceAssistantSwitch: () => boolean // 获取服务助手开关
  setServiceAssistantSwitch: (enabled: boolean) => void // 设置服务助手开关
  setSubscribeFolderUsingSmallRedPoint: (enabled: boolean) => void // 设置订阅文件夹使用小红点
  clearGuildNoticeRedPoint: () => void // 清除公会通知小红点
  clearFeedNoticeRedPoint: () => void // 清除信息流通知小红点
  clearFeedSquareRead: () => void // 清除信息广场已读状态
  clearGuildVoiceChannelRedPoint: () => void // 清除公会语音频道小红点
  IsC2CStyleChatType: () => boolean // 是否为C2C聊天类型
  IsTempChatType: () => boolean // 是否为临时聊天类型
  getGuildInteractiveNotification: () => any // 获取公会互动通知
  getGuildNotificationAbstract: () => any // 获取公会通知摘要
  setFocusOnBase: (focusId: string) => void // 设置关注基本信息
  queryArkInfo: () => any // 查询Ark信息
  queryUserSecQuality: () => WrapperAsyncResponse<{
    rsp: {
      userSecQuality: { allowGuild: boolean }
    }
  }> // 查询用户安全质量
  getGuildMsgAbFlag: () => any // 获取公会消息AB标志
  getGroupMsgStorageTime: () => number // 获取群组消息存储时间
  likeOrDislikeReportForMsg: (msgId: string, like: boolean) => void // 对消息进行点赞或点踩报告
  feedBackReportForMsg: (msgId: string, feedback: string) => void // 对消息进行反馈报告
}
