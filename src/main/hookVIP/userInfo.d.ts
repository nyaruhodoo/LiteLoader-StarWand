export interface UserDetailInfoResponseType {
  result: number
  errMsg: string
  detail: Map<string, UserInfo>
}

type CoreInfo = {
  uid: string
  uin: string
  nick: string
  remark: string
}

type BaseInfo = {
  qid: string
  longNick: string
  birthday_year: number
  birthday_month: number
  birthday_day: number
  age: number
  sex: number
  eMail: string
  phoneNum: string
  categoryId: number
  richTime: number
  richBuffer: Uint8Array
}

type CustomStatus = {
  faceId: string
  faceType: string
  wording: string
}

type VideoBizInfo = {
  cid: string
  tvUrl: string
  synchType: string
}

type VideoInfo = {
  name: string
}

type ExtOnlineBusinessInfo = {
  buf: Uint8Array
  customStatus: CustomStatus | null
  videoBizInfo: VideoBizInfo
  videoInfo: VideoInfo
}

type Status = {
  uid: string
  uin: string
  status: number
  extStatus: number
  batteryStatus: number
  termType: number
  netType: number
  iconType: number
  customStatus: CustomStatus
  setTime: string
  specialFlag: number
  abiFlag: number
  eNetworkType: number
  showName: string
  termDesc: string
  musicInfo: { buf: Uint8Array }
  extOnlineBusinessInfo: ExtOnlineBusinessInfo
  extBuffer: { buf: Uint8Array }
}

type Icon = {
  jumpUrl: string
  iconUrl: string
  iconPath: string
  deluxeIconUrl: string
  deluxeIconPath: string
  isBig: number
  type: number
  level: number
  flag: number
}

type PrivilegeIcon = {
  jumpUrl: string
  openIconList: Icon[]
  closeIconList: Icon[]
}

export type VasInfo = {
  vipFlag: boolean
  yearVipFlag: boolean
  svipFlag: boolean
  vipLevel: number
  bigClub: boolean
  bigClubLevel: number
  nameplateVipType: number
  grayNameplateFlag: number
  superVipTemplateId: number
  diyFontId: number
  pendantId: number
  pendantDiyId: number
  faceId: number
  vipFont: number
  vipFontType: number
  magicFont: number
  fontEffect: number
  newLoverDiamondFlag: number
  extendNameplateId: number
  diyNameplateIDs: any[]
  vipStartFlag: number
  vipDataFlag: number
  gameNameplateId: string
  gameLastLoginTime: string
  gameRank: number
  gameIconShowFlag: boolean
  gameCardId: string
  vipNameColorId: string
  privilegeIcon: PrivilegeIcon
}

type RelationFlags = {
  topTime: string
  isBlock: boolean
  isMsgDisturb: boolean
  isSpecialCareOpen: boolean
  isSpecialCareZone: boolean
  ringId: string
  isBlocked: boolean
  recommendImgFlag: number
  disableEmojiShortCuts: number
  qidianMasterFlag: number
  qidianCrewFlag: number
  qidianCrewFlag2: number
  isHideQQLevel: number
  isHidePrivilegeIcon: number
}

type CommonExt = {
  constellation: number
  shengXiao: number
  kBloodType: number
  homeTown: string
  makeFriendCareer: number
  pos: string
  college: string
  country: string
  province: string
  city: string
  postCode: string
  address: string
  regTime: number
  interest: string
  labels: any[]
  qqLevel: { crownNum: number; sunNum: number; moonNum: number; starNum: number }
}

export type SimpleInfo = {
  uid: string
  uin: string
  coreInfo: CoreInfo
  baseInfo: BaseInfo
  status: Status
  vasInfo: VasInfo
  relationFlags: RelationFlags
  otherFlags: any
  intimate: any
}

type PhotoWall = any

export type UserInfo = {
  uid: string
  uin: string
  simpleInfo: SimpleInfo
  commonExt: CommonExt
  photoWall: PhotoWall
}
