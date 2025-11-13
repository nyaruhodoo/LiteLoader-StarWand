export interface PicElement {
  md5HexStr: string
  fileSize: number | string
  picWidth: number
  picHeight: number
  fileName: string
  sourcePath: string
  original: boolean
  picType: 1000 | 2000
  picSubType: number
  fileUuid: string
  fileSubId: string
  thumbFileSize: number
  summary: string
}

export interface GrayTipElement {
  subElementType: number
  revokeElement: {
    operatorTinyId: string
    operatorRole: string
    operatorUid: string
    operatorNick: string
    operatorRemark: string
    operatorMemRemark: string
    origMsgSenderUid: string
    origMsgSenderNick: string
    origMsgSenderRemark: string
    origMsgSenderMemRemark: string
    isSelfOperate: boolean
    wording: string
  } | null
  proclamationElement: any | null // 根据实际情况调整类型
  emojiReplyElement: any | null // 根据实际情况调整类型
  groupElement: any | null // 根据实际情况调整类型
  buddyElement: any | null // 根据实际情况调整类型
  feedMsgElement: any | null // 根据实际情况调整类型
  essenceElement: any | null // 根据实际情况调整类型
  groupNotifyElement: any | null // 根据实际情况调整类型
  buddyNotifyElement: any | null // 根据实际情况调整类型
  xmlElement: {
    busiType: string // 业务类型
    busiId: string // 业务ID
    c2cType: number // C2C类型标识
    serviceType: number // 服务类型
    ctrlFlag: number // 控制标记
    content: string // 消息内容（含富文本标签）
    templId: string // 模板ID
    seqId: string // 消息序列号
    templParam: Map<string, string> // 模板参数映射
    pbReserv: null // 预留字段（无数据）
    members: Map<string, string> // 成员映射（key为uin标识，value为昵称）
  } | null
  fileReceiptElement: any | null // 根据实际情况调整类型
  localGrayTipElement: any | null // 根据实际情况调整类型
  blockGrayTipElement: any | null // 根据实际情况调整类型
  aioOpGrayTipElement: any | null // 根据实际情况调整类型
  jsonGrayTipElement: any | null // 根据实际情况调整类型
  walletGrayTipElement: any | null // 根据实际情况调整类型
}

export interface TextElement {
  content: string
  atType: number
  atUid: string
  atTinyId: string
  atNtUid: string
  subElementType: number
  atChannelId: string
  linkInfo: null | {
    title: string
    icon: string
    desc: string
    richStatus: number
    tencentDocType: null
  }
  atRoleId: string
  atRoleColor: 0
  atRoleName: string
  needNotify: 0
}

export interface ReplyElement {
  replayMsgId: string // 回复消息ID
  replayMsgSeq: string // 回复消息序列
  replayMsgRootSeq: string // 根消息序列
  replayMsgRootMsgId: string // 根消息ID
  replayMsgRootCommentCnt: string // 根消息评论数
  sourceMsgIdInRecords: string // 源消息ID
  sourceMsgText: string // 源消息文本
  sourceMsgTextElems: {
    replyAbsElemType: number // 回复元素类型
    textElemContent: string // 文本内容
    faceElem: any | null // 表情元素，可以根据实际情况调整类型
    picElem: any | null // 图片元素，可以根据实际情况调整类型
  }[] // 源消息文本元素数组
  senderUid: string // 发送者用户ID
  senderUidStr: string // 发送者用户ID字符串
  replyMsgClientSeq: string // 回复消息客户端序列
  replyMsgTime: string // 回复消息时间
  replyMsgRevokeType: number // 回复消息撤回类型
  sourceMsgIsIncPic: boolean // 源消息是否包含图片
  sourceMsgExpired: boolean // 源消息是否过期
  anonymousNickName: string | null // 匿名昵称
  originalMsgState: any | null // 原消息状态，可以根据实际情况调整类型
}

export interface FileElement {
  /** 文件MD5值（空字符串表示未获取） */
  fileMd5: string
  /** 文件名（包含后缀） */
  fileName: string
  /** 文件本地路径（Windows系统路径格式） */
  filePath: string
  /** 文件大小（单位：字节，字符串格式存储） */
  fileSize: string
  /** 视频画面高度（像素） */
  picHeight: number
  /** 视频画面宽度（像素） */
  picWidth: number
  /** 缩略图路径映射（key为缩略图尺寸相关标识，value为缩略图本地路径） */
  picThumbPath: Map<number, string>
  /** 10M分片文件的MD5值（空字符串表示未获取） */
  file10MMd5: string
  /** 文件SHA哈希值（空字符串表示未获取） */
  fileSha: string
  /** 文件SHA3哈希值（空字符串表示未获取） */
  fileSha3: string
  /** 文件UUID唯一标识（空字符串表示未生成） */
  fileUuid: string
  /** 文件子ID（空字符串表示未分配） */
  fileSubId: string
  /** 文件业务ID（未定义表示无业务关联） */
  fileBizId: undefined
  /** 缩略图文件大小相关参数（推测为尺寸标识或大小值） */
  thumbFileSize: number
  /** 文件夹ID（未定义表示无所属文件夹） */
  folderId: undefined
}

export interface VideoElement {
  filePath: string
  fileName: string
  videoMd5?: string
  thumbMd5?: string
  fileTime?: number
  thumbSize?: number
  fileFormat?: number
  fileSize?: string
  thumbWidth?: number
  thumbHeight?: number
  busiType?: 0
  subBusiType?: 0
  thumbPath?: Map<number, any>
  transferStatus?: 0
  progress?: 0
  invalidState?: 0
  fileUuid?: string
  fileSubId?: string
  fileBizId?: null
  originVideoMd5?: string
  import_rich_media_context?: null
  sourceVideoCodecFormat?: number
}

export interface WalletElement {
  sendUin: string
  sender: {
    background: number
    icon: number
    title: string
    subTitle: string
    content: string
    linkUrl: string
    blackStripe: string
    notice: string
    titleColor: number
    subtitleColor: number
    actionsPriority: string
    jumpUrl: string
    nativeIOS: string
    nativeAndroid: string
    iconUrl: string
    contentColor: number
    contentBgcolor: number
    aioImageLeft: string
    aioImageRight: string
    cftImage: string
    pbReserve: string
  }
  receiver: {
    background: number
    icon: number
    title: string
    subTitle: string
    content: string
    linkUrl: string
    blackStripe: string
    notice: string
    titleColor: number
    subtitleColor: number
    actionsPriority: string
    jumpUrl: string
    nativeIOS: string
    nativeAndroid: string
    iconUrl: string
    contentColor: number
    contentBgcolor: number
    aioImageLeft: string
    aioImageRight: string
    cftImage: string
    pbReserve: string
  }
  channelId: number
  templateId: number
  resend: number
  msgPriority: number
  redType: number
  billNo: string
  authkey: string
  sessiontype: number
  /**
   * 2: 普通红包
   * 3: 拼手气红包
   * 6: 口令红包
   * 8: 专属红包
   */
  msgType: 2 | 3 | 6 | 8
  envelopeId: number
  name: string
  confType: number
  msgFrom: number
  pcBody: string
  stringIndex: string
  redChannel: number
  grapUin: any[]
  pbReserve: string
  grabState: number
  grabbedAmount: string
}

export interface ArkElement {
  bytesData: string
  linkInfo: null
  subElementType: null
  buildMultiMsgReqInfo: null
}

export interface FaceElement {
  faceIndex: number
  faceText: string
  faceType: number
  packId: string
  stickerId: string
  sourceType: number
  stickerType: number
  resultId: string
  surpriseId: string
  randomType: number
  imageType: null
  pokeType: null
  spokeSummary: null
  doubleHit: null
  vaspokeId: null
  vaspokeName: null
  vaspokeMinver: null
  pokeStrength: null
  msgType: null
  faceBubbleCount: null
  oldVersionStr: null
  pokeFlag: null
  chainCount: number
}

export interface PttElement {
  fileName: string
  filePath: string
  md5HexStr: string
  fileSize: string
  duration: number
  formatType: number
  voiceType: number
  autoConvertText: number
  voiceChangeType: number
  canConvert2Text: boolean
  fileId: number
  fileUuid: string
  text: string
  translateStatus: number
  transferStatus: number
  progress: number
  playState: number
  waveAmplitudes: number[]
  invalidState: number
  fileSubId: string
  fileBizId: null
  import_rich_media_context: null
  storeID: number
}

export interface AvRecordElement {
  type: number
  time: string
  text: string
  mainType: number
  hasRead: boolean
  exraType: null
}

export enum ElementType {
  /**
   * 文本消息
   */
  TextElement = 1,
  /**
   * 图片消息
   */
  PicElement = 2,
  FileElement = 3,
  /**
   * 语音消息
   */
  PttElement = 4,
  VideoElement = 5,
  /**
   * 表情包消息
   */
  FaceElement = 6,
  ReplyElement = 7,
  /**
   * 类似拍一拍的灰色消息
   */
  GrayTipElement = 8,
  /**
   * 卡片消息，塞万物
   */
  ArkElement = 10,
  /**
   * 测试语音通话的时候出现的灰色提示
   */
  AvRecordElement = 21,
}

export interface Element {
  elementType: ElementType
  elementId: string
  elementGroupId: number
  extBufForUI: Uint8Array
  textElement?: TextElement
  faceElement?: FaceElement
  marketFaceElement?: null
  replyElement?: ReplyElement
  picElement?: PicElement
  pttElement?: PttElement
  videoElement?: VideoElement
  grayTipElement?: GrayTipElement
  arkElement?: ArkElement | null
  fileElement?: FileElement
  liveGiftElement?: null
  markdownElement?: null
  structLongMsgElement?: null
  multiForwardMsgElement?: null
  giphyElement?: null
  walletElement?: WalletElement
  inlineKeyboardElement?: null
  textGiftElement?: null
  calendarElement?: null
  yoloGameResultElement?: null
  avRecordElement?: AvRecordElement
  structMsgElement?: null
  faceBubbleElement?: null
  shareLocationElement?: null
  tofuRecordElement?: null
  taskTopMsgElement?: null
  recommendedMsgElement?: null
  actionBarElement?: null
  prologueMsgElement?: null
}

/**
 * 1 私聊
 * 2 群聊
 * 8 发送给手机
 */
export type ChatType = 1 | 2 | 8

export interface PeerInfo {
  chatType: ChatType
  peerUid: string
  guildId: string
}

export interface MsgInfo {
  /** 消息唯一ID（全局唯一标识） */
  msgId: string
  /** 消息随机数（辅助标识，防止重复） */
  msgRandom: string
  /** 消息序列号（用于消息排序） */
  msgSeq: string
  /** 内容序列号（可能用于内容版本控制，此处固定为0） */
  cntSeq: string
  /** 聊天类型 */
  chatType: ChatType
  /** 消息类型：2 代表系统通知类消息（如踢人通知） */
  msgType: number
  /** 子消息类型：1 代表具体系统通知子类型（细分消息场景） */
  subMsgType: number
  /** 发送类型：0 代表系统自动发送（非用户主动发送） */
  sendType: number
  /** 发送者UID（用户唯一标识，格式为 u_xxx） */
  senderUid: string
  /** 对方UID/群UID（单聊时为对方用户UID，群聊时为群UID） */
  peerUid: string
  /** 频道ID（频道聊天场景使用，此处为空表示非频道场景） */
  channelId: string
  /**  guild ID（社群/公会场景使用，此处为空） */
  guildId: string
  /**  guild 编码（辅助标识，此处为0表示无） */
  guildCode: string
  /** 来源UID（可能用于转发/二次发送场景，此处为0表示无） */
  fromUid: string
  /** 来源应用ID（跨应用消息场景使用，此处为0表示本应用） */
  fromAppid: string
  /** 消息发送时间戳（秒级，如 1760336548 对应具体日期） */
  msgTime: string
  /** 消息元数据（二进制数组，此处为空表示无额外元数据） */
  msgMeta: Uint8Array
  /** 发送状态：2 代表消息已送达（常见枚举：0-发送中，1-发送失败，2-发送成功/送达） */
  sendStatus: number
  /** 发送者备注名（当前用户对发送者的备注，此处为空） */
  sendRemarkName: string
  /** 发送者成员名/消息内容：此处为系统通知文本“你已被踢出群聊” */
  sendMemberName: string
  /** 发送者昵称（发送者的公开昵称，此处为空表示系统消息无昵称） */
  sendNickName: string
  /**  guild 名称（社群/公会名称，此处为空） */
  guildName: string
  /** 频道名称（频道场景使用，此处为空） */
  channelName: string
  /** 消息元素数组（如文本、图片、附件等内容载体，此处为数组类型需根据实际元素结构扩展） */
  elements: Element[] // 若知道具体元素结构，可替换为 ElementType[]（需自定义ElementType）
  /** 消息记录列表（可能用于多段消息/历史记录关联，此处为空） */
  records: Array<unknown>
  /** 表情包点赞列表（存储点赞用户及表情包信息，此处为空） */
  emojiLikesList: Array<unknown>
  /** 评论数量（消息的评论数，此处为0表示无评论） */
  commentCnt: string
  /** 私信标记：0 代表非私信（1 可能代表私信） */
  directMsgFlag: number
  /** 私信成员列表（私信场景的参与成员，此处为空） */
  directMsgMembers: Array<unknown>
  /** 对方名称/群名称 */
  peerName: string
  /** 频率限制信息（如消息发送频率超限提示，此处为空表示无限制） */
  freqLimitInfo: null
  /** 消息是否可编辑：false 代表不可编辑（系统通知通常不可编辑） */
  editable: boolean
  /** 头像元数据（可能用于头像特殊效果，此处为空） */
  avatarMeta: string
  /** 头像挂件（头像上的装饰标识，此处为空） */
  avatarPendant: string
  /** 动态ID（若消息关联动态内容，此处为空） */
  feedId: string
  /** 角色ID（用户在群/频道中的角色标识，此处为0表示默认角色） */
  roleId: string
  /** 时间戳（可能为额外时间标识，此处为0表示未使用） */
  timeStamp: string
  /** 客户端身份信息（如设备标识、登录状态，此处为空） */
  clientIdentityInfo: null
  /** 是否为重要消息：false 代表非重要消息 */
  isImportMsg: boolean
  /** @类型：0 代表未@任何人（1-@所有人，2-@特定人等） */
  atType: number
  /** 角色类型：0 代表默认角色（如管理员为1，普通成员为0等） */
  roleType: number
  /** 来源频道角色信息（用户在对应频道的角色详情，如权限、等级） */
  fromChannelRoleInfo: Record<string, unknown> // 若知道结构可替换为具体接口
  /** 来源 guild 角色信息（用户在对应社群的角色详情） */
  fromGuildRoleInfo: Record<string, unknown> // 若知道结构可替换为具体接口
  /** 等级角色信息（用户等级对应的角色信息，如等级头衔） */
  levelRoleInfo: Record<string, unknown> // 若知道结构可替换为具体接口
  /** 撤回时间戳：0 代表未撤回（非0表示撤回时间） */
  recallTime: string
  /** 是否为在线消息：true 代表消息是在线时接收的 */
  isOnlineMsg: boolean
  /** 通用标记（二进制数组，存储额外状态标记，此处为空） */
  generalFlags: Uint8Array
  /** 客户端序列号（客户端本地消息排序标识，此处为0） */
  clientSeq: string
  /** 文件组大小（多文件消息场景，此处为空表示非文件组消息） */
  fileGroupSize: null
  /** 折叠信息（长消息/多元素消息的折叠配置，此处为空） */
  foldingInfo: null
  /** 多语言翻译信息（消息的多语言版本，此处为空） */
  multiTransInfo: null
  /** 发送者UIN（腾讯系产品常见标识，与UID对应，用于兼容旧系统） */
  senderUin: string
  /** 对方UIN（与 peerUid 对应，兼容旧系统） */
  peerUin: string
  /** 消息属性映射表（存储额外的键值对属性，如消息优先级、加密状态等） */
  msgAttrs: Map<unknown, unknown> // 若知道键值类型，可替换为 Map<KeyType, ValueType>
  /** 匿名扩展信息（匿名消息场景使用，此处为空表示非匿名） */
  anonymousExtInfo: null
  /** 名称类型：0 代表默认名称显示规则（如显示昵称/群名） */
  nameType: number
  /** 头像标记：0 代表默认头像规则（如是否显示自定义头像） */
  avatarFlag: number
  /** UI扩展信息（用于前端渲染的额外配置，此处为空） */
  extInfoForUI: null
  /** 个人勋章信息（用户拥有的勋章展示，此处为空） */
  personalMedal: null
  /** 分类管理标识：0 代表默认分类（可能用于消息分类归档） */
  categoryManage: number
  /** 消息事件信息（如消息触发的后续事件，此处为空） */
  msgEventInfo: null
  /** 来源类型：1 代表消息来源于官方客户端（0-第三方，1-官方等） */
  sourceType: number
}
