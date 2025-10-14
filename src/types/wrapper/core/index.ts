import type { NodeIKernelLoginService } from './NodeIKernelLoginService'
import type { NodeIO3MiscService } from './NodeIO3MiscService'
import type { NodeIOPSafePwdEdit } from './NodeIOPSafePwdEdit'
import type { NodeIQQNTWrapperEngine } from './NodeIQQNTWrapperEngine'
import type { NodeIQQNTWrapperSession } from './NodeIQQNTWrapperSession'
import type { NodeQQNTWrapperUtil } from './NodeQQNTWrapperUtil'
import type { DeepPath, ResolvePath } from '@/types/utils'

/**
 * 只有 NodeIQQNTWrapperSession 是调用的 create 其他均是 get
 */
type WrapperApiWithMethods<
  T = unknown,
  IncludeMethods extends ('get' | 'create')[] = ['get'],
> = {
  new (...args: unknown[]): T
} & {
  [K in IncludeMethods[number]]?: () => T;
}

type FilterListener<T extends string> = T extends `${string}Listener/${string}`
  ? T
  : never

export interface Wrapper {
  // NodeIKernelECDHService: WrapperApiWithMethods
  NodeIQQNTWrapperEngine: WrapperApiWithMethods<NodeIQQNTWrapperEngine>
  NodeIKernelLoginService: WrapperApiWithMethods<NodeIKernelLoginService>
  NodeIOPSafePwdEdit: WrapperApiWithMethods<NodeIOPSafePwdEdit>
  NodeIQQNTWrapperSession: WrapperApiWithMethods<
    NodeIQQNTWrapperSession,
    ['create']
  >
  // NodeIQQEmailService: WrapperApiWithMethods
  // NodeIKernelBaseEmojiService: WrapperApiWithMethods
  // NodeIKernelEmojiService: WrapperApiWithMethods
  // NodeIShareToWechatService: WrapperApiWithMethods
  // NodeIKernelLockService: WrapperApiWithMethods
  // NodeIKernelGuildMsgService: WrapperApiWithMethods
  // NodeIKernelBdhUploadService: WrapperApiWithMethods
  // NodeIKernelAlbumService: WrapperApiWithMethods
  // NodeIKernelProfileLikeService: WrapperApiWithMethods
  // NodeIKernelNearbyProService: WrapperApiWithMethods
  // NodeIKernelLiteBusinessService: WrapperApiWithMethods
  // NodeIKernelGroupSchoolService: WrapperApiWithMethods
  // NodeIKernelGroupTabService: WrapperApiWithMethods
  // NodeIKernelRobotService: WrapperApiWithMethods
  NodeIO3MiscService: WrapperApiWithMethods<NodeIO3MiscService>
  // NodeIKernelOnlineStatusService: WrapperApiWithMethods
  // NodeIKernelTianShuService: WrapperApiWithMethods
  // NodeIKernelQQPlayService: WrapperApiWithMethods
  // NodeIKernelUnitedConfigService: WrapperApiWithMethods
  // NodeIKernelWiFiPhotoHostService: WrapperApiWithMethods
  // NodeIKernelWiFiPhotoGetAlbumListCallback: WrapperApiWithMethods
  // NodeIKernelWiFiPhotoGetAllPhotoSimpleInfoCallback: WrapperApiWithMethods
  // NodeIKernelWiFiPhotoGetPhotoInfoBatchCallback: WrapperApiWithMethods
  // NodeIKernelWiFiPhotoGetPhotoCallback: WrapperApiWithMethods
  // NodeIKernelWiFiPhotoDeletePhotoBatchCallback: WrapperApiWithMethods
  // NodeIKernelWiFiPhotoClientService: WrapperApiWithMethods
  // NodeIKernelUixConvertService: WrapperApiWithMethods
  // NodeIKernelDbToolsService: WrapperApiWithMethods
  // NodeIKernelTestPerformanceService: WrapperApiWithMethods
  // NodeIKernelSkinService: WrapperApiWithMethods
  // NodeIKernelTicketService: WrapperApiWithMethods
  // NodeIKernelCollectionService: WrapperApiWithMethods
  // NodeISpan: WrapperApiWithMethods
  NodeQQNTWrapperUtil: NodeQQNTWrapperUtil
  // NodeIQQNTWrapperNetwork: WrapperApiWithMethods
  // NodeIKernelGuildService: WrapperApiWithMethods
  // NodeIKernelTipOffService: WrapperApiWithMethods
  // NodeIKernelFileAssistantService: WrapperApiWithMethods
  // NodeIKernelQiDianService: WrapperApiWithMethods
  // NodeIKernelStorageCleanService: WrapperApiWithMethods
  // NodeIKernelSettingService: WrapperApiWithMethods
  // NodeIKernelYellowFaceForManagerService: WrapperApiWithMethods
  // NodeIKernelYellowFaceService: WrapperApiWithMethods
  // NodeIKernelNewFeedService: WrapperApiWithMethods
  // NodeIKernelFeedService: WrapperApiWithMethods
  // NodeIKernelRichMediaService: WrapperApiWithMethods
  // NodeIKernelAvatarService: WrapperApiWithMethods
  // NodeIKernelRDeliveryService: WrapperApiWithMethods
  // NodeIKernelDirectSessionService: WrapperApiWithMethods
  // NodeIKernelConfigMgrService: WrapperApiWithMethods
  // NodeIKernelRecentContactService: WrapperApiWithMethods
  // NodeIKernelProfileService: WrapperApiWithMethods
  // NodeIKernelMsgService: WrapperApiWithMethods
  // NodeIKernelGroupService: WrapperApiWithMethods
  // NodeIKernelSearchService: WrapperApiWithMethods
  // NodeIKernelBuddyService: WrapperApiWithMethods
  // NodeIKernelMSFService: WrapperApiWithMethods
  // NodeIKernelNodeMiscService: WrapperApiWithMethods
  // NodeIGuildHotUpdateService: WrapperApiWithMethods
  // NodeIKernelMsgBackupService: WrapperApiWithMethods
  // NodeIKernelRemotingService: WrapperApiWithMethods
  // NodeIKernelAVSDKService: WrapperApiWithMethods
}
export type WrapperPaths = DeepPath<Wrapper>
export type WrapperResponsePaths = `${WrapperPaths}:response`
export type WrapperResolvePath<T extends string> = T extends WrapperPaths
  ? ResolvePath<Wrapper, T>
  : never
export type ListenerPaths = FilterListener<WrapperPaths>

// 监听器会包含调用参数以及响应结果
export type WrapperEventMap = {
  [K in WrapperPaths]: [
    {
      applyRet: Awaited<ReturnType<WrapperResolvePath<K>>>
      params: Parameters<WrapperResolvePath<K>>
    },
  ];
}
// 拦截器可以拦截调用前或调用后
type WrapperAllPaths = WrapperPaths | WrapperResponsePaths
type getParams<T extends WrapperAllPaths> = T extends `${infer Name}:response`
  ? {
      applyRet: ReturnType<WrapperResolvePath<Name>>
      params: Parameters<WrapperResolvePath<Name>>
    }
  : Parameters<WrapperResolvePath<T>>
type getReturn<T extends WrapperAllPaths> = T extends `${infer Name}:response`
  ? ReturnType<WrapperResolvePath<Name>>
  : Parameters<WrapperResolvePath<T>>
export type WrapperInterceptors = {
  [K in WrapperAllPaths]?: (params: getParams<K>) => getReturn<K> | void;
}
