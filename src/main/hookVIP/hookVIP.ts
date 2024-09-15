// import { inspect } from 'node:util'
import { EventEnum } from '../enum/eventEnum'
import type { SimpleInfo, UserDetailInfoResponseType, UserInfo, VasInfo } from './userInfo'
// import { inspect } from 'node:util'

const fixVasInfo = (vasInfo: VasInfo) => {
  // 作用不知道
  vasInfo.vipStartFlag = 0
  vasInfo.vipDataFlag = 0

  // 有这几个就够了
  vasInfo.vipFlag = true
  vasInfo.svipFlag = true
  vasInfo.yearVipFlag = true
  vasInfo.vipLevel = 10

  // 从群中产里抓的数据，凑活用吧
  vasInfo.nameplateVipType = 258
  vasInfo.superVipTemplateId = 20471
  vasInfo.pendantId = 104493
  vasInfo.vipDataFlag = 107
  vasInfo.vipNameColorId = '6'

  vasInfo.privilegeIcon.openIconList = []
  vasInfo.privilegeIcon.closeIconList = []

  return vasInfo
}

const getUid = (): string => {
  return globalThis?.authData?.uid ?? ''
}

export const vipEventInterceptors = {
  // 左上角个人信息会取这个
  async [EventEnum.fetchUserDetailInfo + ':response'](data: Promise<UserDetailInfoResponseType>) {
    const uid = getUid()
    const responseData = await data
    const userData = responseData.detail.get(uid)
    if (!userData) return

    userData.simpleInfo.vasInfo = fixVasInfo(userData.simpleInfo.vasInfo)

    return responseData
  },

  // 反正很多地方会触发
  [EventEnum.onUserDetailInfoChanged]([userInfo]: [UserInfo]) {
    // console.log(
    //   inspect(userInfo, {
    //     depth: null,
    //     colors: true
    //   })
    // )

    const uid = getUid()
    if (userInfo.uid !== uid) return
    userInfo.simpleInfo.vasInfo = fixVasInfo(userInfo.simpleInfo.vasInfo)
  },

  // 哪里有用到我还真不知道
  [EventEnum.onProfileSimpleChanged]([userInfoMap]: [Map<string, SimpleInfo>]) {
    const uid = getUid()
    const userInfo = userInfoMap.get(uid)
    if (!userInfo || !userInfo.vasInfo) return
    userInfo.vasInfo = fixVasInfo(userInfo.vasInfo)
  },

  // 好友里的
  [EventEnum.getVasInfo + ':response'](userVasMap: Map<string, VasInfo>) {
    const uid = getUid()
    const userVans = userVasMap.get(uid)
    if (!userVans) return
    fixVasInfo(userVans)
  }
}
