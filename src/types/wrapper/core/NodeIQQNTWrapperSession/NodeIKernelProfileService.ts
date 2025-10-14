import type { BaseInfo, CoreInfo, RelationFlags, UserStatus, VasInfo } from './User'

interface ProfileListener {
  /**
   * 当用户的简单资料信息发生变化时调用的回调函数
   */
  onProfileSimpleChanged: (
    params: Map<
      string,
      {
        uid: string
        uin: string
        coreInfo: null | CoreInfo
        baseInfo: null | BaseInfo
        status: null | UserStatus
        vasInfo: null | VasInfo
        relationFlags: null | RelationFlags
        otherFlags: null
        intimate: null
      }
    >
  ) => void

  /**
   * 当用户的详细信息发生变化时调用的回调函数
   */
  onUserDetailInfoChanged: () => void

  /**
   * 当用户的状态更新时调用的回调函数
   */
  onStatusUpdate: (
    params: Map<
      string,
      {
        uid: string
        uin: string
        status: number
        extStatus: number
        batteryStatus: number
        termType: number
        netType: number
        iconType: number
        customStatus: null
        setTime: string
        specialFlag: number
        abiFlag: number
        eNetworkType: number
        showName: string
        termDesc: string
        musicInfo: { buf: Uint8Array }
        extOnlineBusinessInfo: {
          buf: Uint8Array
          customStatus: null
          videoBizInfo: { cid: string, tvUrl: string, synchType: string }
          videoInfo: { name: string }
        }
        extBuffer: { buf: Uint8Array }
      }
    >
  ) => void

  /**
   * 当用户的状态字段异步更新时调用的回调函数
   */
  onStatusAsyncFieldUpdate: () => void

  /**
   * 当用户自身的状态变化时调用的回调函数
   */
  onSelfStatusChanged: () => void

  /**
   * 当陌生人备注信息发生变化时调用的回调函数
   */
  onStrangerRemarkChanged: () => void
}

export interface NodeIKernelProfileService {
  /** 添加用户资料监听器 */
  addKernelProfileListener: (listener: ProfileListener) => void

  /** 为 UI 缓存添加用户资料监听器 */
  addKernelProfileListenerForUICache: (listener: ProfileListener) => void

  /** 移除用户资料监听器 */
  removeKernelProfileListener: (listener: unknown) => void

  /** 准备地区配置 */
  prepareRegionConfig: () => Promise<void>

  /** 获取本地陌生人备注 */
  getLocalStrangerRemark: (uin: string) => string

  /** 枚举国家选项 */
  enumCountryOptions: () => Promise<string[]>

  /** 枚举省份选项 */
  enumProvinceOptions: (countryCode: string) => Promise<string[]>

  /** 枚举城市选项 */
  enumCityOptions: (provinceCode: string) => Promise<string[]>

  /** 枚举地区选项 */
  enumAreaOptions: (cityCode: string) => Promise<string[]>

  /** 修改自己的用户资料 */
  modifySelfProfile: (profileData: any) => Promise<void>

  /** 修改桌面迷你用户资料 */
  modifyDesktopMiniProfile: (miniProfileData: any) => Promise<void>

  /** 设置昵称 */
  setNickName: (nickName: string) => Promise<void>

  /** 设置长昵称 */
  setLongNick: (longNick: string) => Promise<void>

  /** 设置生日 */
  setBirthday: (birthday: Date) => Promise<void>

  /** 设置性别 */
  setGander: (gender: 'male' | 'female') => Promise<void>

  /** 设置头像 */
  setHeader: (headerData: any) => Promise<void>

  /** 设置推荐图片标志 */
  setRecommendImgFlag: (flag: boolean) => Promise<void>

  /** 获取用户简单信息 */
  getUserSimpleInfo: (p1: boolean, p2: [string]) => WrapperAsyncResponse

  /** 获取用户详细信息 */
  getUserDetailInfo: (uin: string) => Promise<any>

  /** 获取带业务信息的用户详细信息 */
  getUserDetailInfoWithBizInfo: (uin: string) => Promise<any>

  /** 根据 UIN 获取用户详细信息 */
  getUserDetailInfoByUin: (uin: string) => Promise<any>

  /** 获取 Zplan 头像信息 */
  getZplanAvatarInfos: (uin: string) => Promise<any>

  /** 获取状态 */
  getStatus: (uin: string) => WrapperAsyncResponse

  /** 开始状态轮询 */
  startStatusPolling: (uin: string) => void

  /** 获取自己的状态 */
  getSelfStatus: () => Promise<string>

  /** 设置禁用 Emoji 快捷键 */
  setdisableEmojiShortCuts: (flag: boolean) => Promise<void>

  /** 获取 Qzone 资料图片信息 */
  getProfileQzonePicInfo: (uin: string) => Promise<any>

  /** 获取核心信息 */
  getCoreInfo: (uin: string) => Promise<any>

  /** 获取核心和基础信息 */
  getCoreAndBaseInfo: (uin: string) => Promise<any>

  /** 获取状态信息 */
  getStatusInfo: (uin: string) => Promise<any>

  /** 获取关系标志 */
  getRelationFlag: (uin: string) => Promise<any>

  /** 获取其他标志 */
  getOtherFlag: (uin: string) => Promise<any>

  /** 获取增值服务信息 */
  getVasInfo: (p1: string, p2: string[]) => Map<string, VasInfo>

  /** 获取亲密度信息 */
  getIntimate: (uin: string) => Promise<number>

  /** 获取本地股票数据 */
  getStockLocalData: () => Promise<any>

  /** 更新本地股票数据 */
  updateStockLocalData: (data: any) => Promise<void>

  /** 更新用户资料数据 */
  updateProfileData: (data: any) => Promise<void>

  /** 根据 UID 获取 UIN */
  getUinByUid: (uid: string) => Promise<string>

  /** 根据 UIN 获取 UID */
  getUidByUin: (uin: string) => Promise<string>

  /** 获取用户详细信息 */
  fetchUserDetailInfo: (uin: string) => Promise<any>
}
