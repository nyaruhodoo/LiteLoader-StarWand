interface GuildListener {
  // 会话初始化相关回调
  onSessionInitComplete: () => void

  // 公会列表更新相关回调
  onGuildListUpdated: () => void
  onFirstFewGuildsLoaded: () => void
  onGuildListLoaded: () => void
  onChannelListUpdated: () => void
  onAllGuildChannelListFetchCompleted: () => void

  // 公会信息更新相关回调
  onGuildInfoUpdated: () => void
  onChannelInfoUpdated: () => void
  onUserListFetchFinish: () => void
  onRefreshGuildUserProfileInfo: () => void

  // 公会成员变动相关回调
  onPushCreateGuild: () => void
  onPushDestroyGuild: () => void
  onPushJoinGuild: () => void
  onPushJoinGuildFail: () => void
  onPushKickOffGuild: () => void
  onPushQuitGuild: () => void

  // 频道操作相关回调
  onPushChannelCreated: () => void
  onPushChannelDestroy: () => void
  onPushJoinChannel: () => void
  onPushBatchJoinChannel: () => void
  onPushLeaveChannel: () => void
  onPushBatchLeaveChannel: () => void
  onPushChannelVisibleChanged: () => void
  onPushChannelTopMsgUpdated: () => void

  // 公会权限及状态变更相关回调
  onPushGuildStateChange: () => void
  onPushChannelStateChange: () => void
  onPushUserChannelStateChange: () => void
  onPushAdminChanged: () => void
  onPushGuildPermissionChanged: () => void

  // 用户音视频状态相关回调
  onPushAudioChannelUserEnter: () => void
  onPushAudioChannelUserExit: () => void
  onPushAudioChannelUserPlatSwitch: () => void
  onPushKickOutAudioChannel: () => void
  onPushUserMuteSeatInGuild: () => void
  onPushUserScreenShare: () => void
  onPushAllowScreenShareInGuild: () => void

  // 公会活动与频道事件相关回调
  onPushInviteMemberEvent: () => void
  onPushLiveChannelAnchorIdentityChange: () => void
  onPushLiveRoomStatusChangeMsg: () => void
  onPushSwitchLiveRoom: () => void
  onPushSelfBannedSpeakChange: () => void
  onPushLiveRoomInfoChange: () => void
  onPushChannelCategoryChanged: () => void

  // 成员计数与通知列表更新
  onMemberCountUpdate: () => void
  onNoticeListUpdate: () => void

  // 公会角色变动相关回调
  onPushCreateRole: () => void
  onPushDeleteRole: () => void
  onPushModifyRole: () => void
  onPushSortRole: () => void
  onPushChangeRoleMember: () => void
  onPushMemberTopRoleChanged: () => void

  // 公会安全、心跳、数据报告相关回调
  onPushSecurityResult: () => void
  onPollingResult: () => void
  onReportSqliteError: () => void
  onOpenTelemetryMetricTimeCostReport: () => void
  onOpenTelemetryMetricCountReport: () => void
  onOpenTelemetryTraceReport: () => void

  // 其他杂项回调
  onChangeGuildNumber: () => void
  onTabRedPointPollingResult: () => void
  onPushAVHeartbeatRsp: () => void
  onPushAVChannelPlayListChange: () => void
  onPushAVChannelAppMsg: () => void
  onBroadcastUserCountUpdate: () => void
  onBroadcastRoomClose: () => void
  onGlobalBannerUpdated: () => void
  onGlobalBannerRemoved: () => void
}
export interface NodeIKernelGuildService {
  /**
   * 监听和取消监听内核公会事件
   */
  addKernelGuildListener: (listener: GuildListener) => void
  removeKernelGuildListener: (listener: GuildListener) => void

  /**
   * 加载公会和频道相关信息
   */
  loadGuildAndChannels: () => Promise<void>
  refreshGuildList: () => Promise<void>
  refreshGuildInfo: (guildId: string) => Promise<void>
  refreshGuildInfoOnly: (guildId: string) => Promise<void>
  refreshChannelInfo: (channelId: string) => Promise<void>

  /**
   * 从缓存中获取公会及频道列表
   */
  getGuildAndChannelListFromCache: () => Promise<any>

  /**
   * 获取/刷新指定的公会和频道信息
   */
  fetchGuildInfo: (guildId: string) => Promise<any>
  fetchChannelInfo: (channelId: string) => Promise<any>

  /**
   * 操作用户列表
   */
  loadUserList: (guildId: string) => Promise<any>
  fetchUserList: (guildId: string) => Promise<any>
  getUserList: (guildId: string) => Promise<any>
  loadUserInfo: (userId: string) => Promise<any>
  fetchUserInfo: (userId: string) => Promise<any>

  /**
   * 添加、移除和销毁公会
   */
  addGuild: (guildData: any) => Promise<void>
  addGuilds: (guilds: any[]) => Promise<void>
  addGuildWithOption: (guildData: any, options: any) => Promise<void>
  removeGuild: (guildId: string) => Promise<void>
  destroyGuild: (guildId: string) => Promise<void>

  /**
   * 公会用户管理（踢出成员、设置管理员等）
   */
  kickGuildUser: (guildId: string, userId: string) => Promise<void>
  setGuildAdmin: (guildId: string, userId: string, isAdmin: boolean) => Promise<void>

  /**
   * 频道创建与删除
   */
  createChannelWithId: (guildId: string, channelData: any) => Promise<void>
  removeChannel: (channelId: string) => Promise<void>

  /**
   * 设置/获取频道和公会的相关信息（置顶、通知等）
   */
  setGuildTop: (guildId: string, isTop: boolean) => Promise<void>
  setChannelMsgNotifyType: (channelId: string, notifyType: string) => Promise<void>
  getGuildMemberNum: (guildId: string) => Promise<number>

  /**
   * 频道权限设置
   */
  setChannelSpeakerPerm: (channelId: string, userId: string, hasPerm: boolean) => Promise<void>
  setChannelBannedSpeak: (channelId: string, userId: string, isBanned: boolean) => Promise<void>

  /**
   * 设置用户资料（昵称、性别等）
   */
  setNickName: (userId: string, nickName: string) => Promise<void>
  setGender: (userId: string, gender: string) => Promise<void>
  setLocation: (userId: string, location: string) => Promise<void>
  setHeader: (userId: string, headerUrl: string) => Promise<void>

  /**
   * 邀请信息
   */
  fetchInviteInfo: (inviteCode: string) => Promise<any>

  /**
   * 心跳、加入/退出语音频道
   */
  startHeartbeat: () => void
  enterAudioChannel: (channelId: string) => Promise<void>
  exitAudioChannel: (channelId: string) => Promise<void>

  /**
   * 管理和配置直播
   */
  startAnchorBroadcast: (channelId: string) => Promise<void>
  terminateLiveStream: (channelId: string) => Promise<void>
  fetchLiveChannelBannedUserList: (channelId: string) => Promise<any>

  /**
   * 公会和频道搜索
   */
  searchGuild: (keyword: string) => Promise<any>
  searchChannelContent: (channelId: string, keyword: string) => Promise<any>

  /**
   * 实名认证和防沉迷验证
   */
  checkSelfRealNameVerified: () => Promise<boolean>
  doRealNameAuth: (userId: string, authInfo: any) => Promise<void>
  checkPreventAddiction: () => Promise<boolean>

  /**
   * 获取用户直播信息
   */
  getUserLiveInfo: (userId: string) => Promise<any>
  setUserLiveInfo: (userId: string, liveInfo: any) => Promise<void>

  /**
   * 公会日程表管理
   */
  createSchedule: (guildId: string, scheduleData: any) => Promise<void>
  editSchedule: (scheduleId: string, scheduleData: any) => Promise<void>
  getScheduleList: (guildId: string) => Promise<any>

  /**
   * 获取和设置UI相关数据
   */
  setUIData: (key: string, value: any) => void
  getUIData: (key: string) => any

  // 其他大量方法省略
}
