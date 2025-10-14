import type { NodeIGuildHotUpdateService } from './NodeIGuildHotUpdateService'
import type { NodeIKernelAvatarService } from './NodeIKernelAvatarService'
import type { NodeIKernelAVSDKService } from './NodeIKernelAVSDKService'
import type { NodeIKernelBaseEmojiService } from './NodeIKernelBaseEmojiService'
import type { NodeIKernelBuddyService } from './NodeIKernelBuddyService'
import type { NodeIKernelCollectionService } from './NodeIKernelCollectionService'
import type { NodeIKernelConfigMgrService } from './NodeIKernelConfigMgrService'
import type { NodeIKernelDirectSessionService } from './NodeIKernelDirectSessionService'
import type { NodeIKernelFeedService } from './NodeIKernelFeedService'
import type { NodeIKernelFileAssistantService } from './NodeIKernelFileAssistantService'
import type { NodeIKernelGroupService } from './NodeIKernelGroupService'
import type { NodeIKernelGuildService } from './NodeIKernelGuildService'
import type { NodeIKernelLockService } from './NodeIKernelLockService'
import type { NodeIKernelMSFService } from './NodeIKernelMSFService'
import type { NodeIKernelMsgBackupService } from './NodeIKernelMsgBackupService'
import type { NodeIKernelMsgService } from './NodeIKernelMsgService'
import type { NodeIKernelNodeMiscService } from './NodeIKernelNodeMiscService'
import type { NodeIKernelOnlineStatusService } from './NodeIKernelOnlineStatusService'
import type { NodeIKernelProfileLikeService } from './NodeIKernelProfileLikeService'
import type { NodeIKernelProfileService } from './NodeIKernelProfileService'
import type { NodeIKernelQiDianService } from './NodeIKernelQiDianService'
import type { NodeIKernelQQPlayService } from './NodeIKernelQQPlayService'
import type { NodeIKernelRecentContactService } from './NodeIKernelRecentContactService'
import type { NodeIKernelRemotingService } from './NodeIKernelRemotingService'
import type { NodeIKernelRobotService } from './NodeIKernelRobotService'
import type { NodeIKernelSearchService } from './NodeIKernelSearchService'
import type { NodeIKernelSettingService } from './NodeIKernelSettingService'
import type { NodeIKernelSkinService } from './NodeIKernelSkinService'
import type { NodeIKernelStorageCleanService } from './NodeIKernelStorageCleanService'
import type { NodeIKernelTipOffService } from './NodeIKernelTipOffService'
import type { NodeIKernelUnitedConfigService } from './NodeIKernelUnitedConfigService'
import type { NodeIKernelWiFiPhotoClientService } from './NodeIKernelWiFiPhotoClientService'
import type { NodeIQQEmailService } from './NodeIQQEmailService'

export interface NodeIQQNTWrapperSession {
  // 各种服务获取方法
  getQQEmailService: () => NodeIQQEmailService
  getShareToWechatService: () => any
  getAlbumService: () => any
  getTianShuService: () => any
  getUnitedConfigService: () => NodeIKernelUnitedConfigService
  getTicketService: () => any
  getTipOffService: () => NodeIKernelTipOffService
  getProfileService: () => NodeIKernelProfileService
  getProfileLikeService: () => NodeIKernelProfileLikeService
  getBuddyService: () => NodeIKernelBuddyService
  getSearchService: () => NodeIKernelSearchService
  getGroupService: () => NodeIKernelGroupService
  getMsgService: () => NodeIKernelMsgService
  getRichMediaService: () => any
  getRecentContactService: () => NodeIKernelRecentContactService
  getConfigMgrService: () => NodeIKernelConfigMgrService
  getDirectSessionService: () => NodeIKernelDirectSessionService
  getRDeliveryService: () => any
  getAvatarService: () => NodeIKernelAvatarService
  getFeedChannelService: () => NodeIKernelFeedService
  getNewFeedChannelService: () => any
  getYellowFaceService: () => any
  getCollectionService: () => NodeIKernelCollectionService
  getSettingService: () => NodeIKernelSettingService
  getStorageCleanService: () => NodeIKernelStorageCleanService
  getQiDianService: () => NodeIKernelQiDianService
  getFileAssistantService: () => NodeIKernelFileAssistantService
  getGuildService: () => NodeIKernelGuildService
  getSkinService: () => NodeIKernelSkinService
  getTestPerformanceService: () => any
  getQQPlayService: () => NodeIKernelQQPlayService
  getDbToolsService: () => any
  getUixConvertService: () => any
  getWiFiPhotoClientService: () => NodeIKernelWiFiPhotoClientService
  getOnlineStatusService: () => NodeIKernelOnlineStatusService
  getRemotingService: () => NodeIKernelRemotingService
  getRobotService: () => NodeIKernelRobotService
  getGroupTabService: () => any
  getGroupSchoolService: () => any
  getLiteBusinessService: () => any
  getBdhUploadService: () => any
  getGuildMsgService: () => any
  getLockService: () => NodeIKernelLockService
  getEmojiService: () => any
  getBaseEmojiService: () => NodeIKernelBaseEmojiService
  getMSFService: () => NodeIKernelMSFService
  getNodeMiscService: () => NodeIKernelNodeMiscService
  getGuildHotUpdateService: () => NodeIGuildHotUpdateService
  getMsgBackupService: () => NodeIKernelMsgBackupService
  getAVSDKService: () => NodeIKernelAVSDKService

  // 会话管理方法
  init: () => void // 初始化
  destroy: () => void // 销毁
  startNT: () => void // 启动 NT
  startGPro: () => void // 启动 GPro
  close: () => void // 关闭会话
  getSessionId: () => string // 获取会话 ID
  updateTicket: (ticket: any) => void // 更新票据
  onLine: () => void // 上线
  offLine: (params: {
    deviceInfo: {
      guid: string
      buildVer: string
      localId: number
      devName: string
      devType: string
      vendorName: string
      osVer: string
      vendorOsName: string
      setMute: boolean
      vendorType: number
    }
  }) => WrapperAsyncResponse // 下线
  offLineSync: () => void // 同步下线
  onSendOidbReply: () => void // 发送 OIDB 回复
  onSendSSOReply: () => void // 发送 SSO 回复
  onNetReply: () => void // 网络回复
  onMsfPush: () => void // Msf 推送
  setOnMsfStatusChanged: (callback: () => void) => void // 设置 Msf 状态变化回调
  setOnNetworkChanged: (callback: () => void) => void // 设置网络变化回调
  setOnWeakNetChanged: (callback: () => void) => void // 设置弱网变化回调
  switchToFront: () => void // 切换到前台
  switchToBackGround: () => void // 切换到后台
  getCacheErrLog: () => any // 获取缓存错误日志
  getAccountPath: () => string // 获取账号路径
  onDispatchRequestReply: () => void // 处理请求回复
  onDispatchPush: () => void // 处理推送
  onDispatchPushWithJson: (data: any) => void // 处理 JSON 推送
  onUIConfigUpdate: () => void // UI 配置更新
  getShortLinkBlacklist: () => any // 获取短链接黑名单
  disableIpDirect: () => void // 禁用 IP 直连
}
