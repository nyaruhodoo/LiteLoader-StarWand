import { EventEnum } from '../enum/eventEnum'
import type { SimpleInfo, UserDetailInfoResponseType, UserInfo, VasInfo } from './userInfo'
// import { inspect } from 'node:util'

const fixVasInfo = (vasInfo: VasInfo) => {
  vasInfo.vipStartFlag = 1
  vasInfo.vipDataFlag = 1
  vasInfo.vipFlag = true
  vasInfo.svipFlag = true
  vasInfo.yearVipFlag = true
  vasInfo.vipLevel = 10
  vasInfo.bigClub = true
  vasInfo.bigClubLevel = 10 // 懒得处理了
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

  // 设置页会取这里的值
  [EventEnum.onUserDetailInfoChanged]([userInfo]: [UserInfo]) {
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
