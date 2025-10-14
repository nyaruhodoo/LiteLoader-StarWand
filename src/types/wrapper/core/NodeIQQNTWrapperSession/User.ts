export interface VasInfo {
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
  diyNameplateIDs: number[]
  vipStartFlag: number
  vipDataFlag: number
  gameNameplateId: string
  gameLastLoginTime: string
  gameRank: number
  gameIconShowFlag: boolean
  gameCardId: string
  vipNameColorId: string
  privilegeIcon: {
    jumpUrl: string
    openIconList: string[]
    closeIconList: string[]
  }
}

export interface CoreInfo {
  uid: string
  uin: string
  nick: string
  remark: string
}

export interface BaseInfo {
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

export interface UserStatus {
  uid: string
  uin: string
  status: number
  extStatus: number
  batteryStatus: number
  termType: number
  netType: number
  iconType: number
  customStatus: {
    faceId: string
    faceType: string
    wording: string
  }
  setTime: string
  specialFlag: number
  abiFlag: number
  eNetworkType: number
  showName: string
  termDesc: string
  musicInfo: {
    buf: Uint8Array
  }
  extOnlineBusinessInfo: {
    buf: Uint8Array
    customStatus: null
    videoBizInfo: {
      cid: string
      tvUrl: string
      synchType: string
    }

    videoInfo: {
      name: string
    }
  }
  extBuffer: {
    buf: Uint8Array
  }
}

export interface RelationFlags {
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
