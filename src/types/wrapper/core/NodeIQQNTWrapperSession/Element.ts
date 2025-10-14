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
  }
  proclamationElement: any | null // 根据实际情况调整类型
  emojiReplyElement: any | null // 根据实际情况调整类型
  groupElement: any | null // 根据实际情况调整类型
  buddyElement: any | null // 根据实际情况调整类型
  feedMsgElement: any | null // 根据实际情况调整类型
  essenceElement: any | null // 根据实际情况调整类型
  groupNotifyElement: any | null // 根据实际情况调整类型
  buddyNotifyElement: any | null // 根据实际情况调整类型
  xmlElement: any | null // 根据实际情况调整类型
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
  linkInfo: null
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
   */
  msgType: number
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

export enum ElementType {
  TextElement = 1,
  PicElement = 2,
  FileElement = 3,
  VIdeoElement = 5,
  ReplyElement = 7,
}

export interface Element {
  elementType: ElementType
  elementId: string
  elementGroupId: number
  extBufForUI: Uint8Array
  textElement?: TextElement
  faceElement?: null
  marketFaceElement?: null
  replyElement?: ReplyElement
  picElement?: PicElement
  pttElement?: null
  videoElement?: VideoElement
  grayTipElement?: GrayTipElement
  arkElement?: null
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
  avRecordElement?: null
  structMsgElement?: null
  faceBubbleElement?: null
  shareLocationElement?: null
  tofuRecordElement?: null
  taskTopMsgElement?: null
  recommendedMsgElement?: null
  actionBarElement?: null
  prologueMsgElement?: null
}

// 1私聊，2群聊，8发送给手机
export type ChatType = 1 | 2 | 8

export interface PeerInfo {
  chatType: ChatType
  peerUid: string
  guildId: string
}
