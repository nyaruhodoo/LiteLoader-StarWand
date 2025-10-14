/**
 * 群组服务事件监听器接口，用于处理与群组相关的各种事件。
 */
interface KernelGroupListener {
  /**
   * 群组列表更新时触发
   */
  onGroupListUpdate: (
    p1: number,
    p2: {
      groupCode: string
      groupUin: string
      groupOwnerId: {
        memberUin: string
        memberUid: string
        memberQid: string
      }
      createTime: string
      maxMember: number
      memberCount: number
      groupName: string
      groupStatus: number
      isTop: boolean
      toppedTimestamp: string
      groupShutupExpireTime: string
      discussToGroupUin: string
      discussToGroupMaxMsgSeq: number
      discussToGroupTime: number
      groupFlagExt: number
      groupClassExt: number
      authGroupType: number
      groupTypeFlag: number
      privilegeFlag: number
      groupCreditLevel: number
      groupFlagExt3: number
      isConf: boolean
      hasModifyConfGroupFace: boolean
      hasModifyConfGroupName: boolean
      groupFlagExt4: number
      groupMemo: Uint8Array
      hasMemo: boolean
      groupSecLevelInfo: number
      appealDeadline: number
      subscriptionUin: string
      hlGuildAppId: number
      hlGuildSubType: number
      memberChangeSeq: number
      groupInfoChangeSeq: number
      memberCardChangeSeq: number
      memberLevelNameSeq: number
      joinTime: number
      memberRole: number
      remarkName: string
      personShutupExpireTime: string
      cmdUinFlag: number
      cmdUinFlagEx2: number
      cmdUinRingtoneId: number
      cmdUinMsgMask: number
    }[]
  ) => boolean

  /**
   * 群组列表初始化完成时触发
   */
  onGroupListInited: () => void

  /**
   * 群组扩展列表更新时触发
   */
  onGroupExtListUpdate: () => void

  /**
   * 群组单屏通知时触发
   */
  onGroupSingleScreenNotifies: () => void

  /**
   * 群组通知更新时触发
   */
  onGroupNotifiesUpdated: () => void

  /**
   * 群组未读通知计数更新时触发
   */
  onGroupNotifiesUnreadCountUpdated: (p1: boolean, p2: string, p3: number) => boolean

  /**
   * 群组详细信息变化时触发
   */
  onGroupDetailInfoChange: (p1: {
    groupCode: string
    groupUin: string
    ownerUid: string
    ownerUin: string
    groupFlag: number
    groupFlagExt: number
    maxMemberNum: number
    memberNum: number
    groupOption: number
    classExt: number
    groupName: string
    fingerMemo: string
    groupQuestion: string
    certType: number
    richFingerMemo: string
    tagRecord: any[]
    shutUpAllTimestamp: number
    shutUpMeTimestamp: number
    groupTypeFlag: number
    privilegeFlag: number
    groupSecLevel: number
    groupFlagExt3: number
    isConfGroup: number
    isModifyConfGroupFace: number
    isModifyConfGroupName: number
    groupFlagExt4: number
    groupMemo: string
    cmdUinMsgSeq: number
    cmdUinJoinTime: number
    cmdUinUinFlag: number
    cmdUinMsgMask: number
    groupSecLevelInfo: number
    cmdUinPrivilege: number
    cmdUinFlagEx2: number
    appealDeadline: number
    remarkName: string
    isTop: boolean
    groupFace: number
    groupGeoInfo: {
      ownerUid: string
      SetTime: number
      CityId: number
      Longitude: string
      Latitude: string
      GeoContent: string
      poiId: string
    }
    certificationText: string
    cmdUinRingtoneId: number
    longGroupName: string
    autoAgreeJoinGroupUserNumForConfGroup: number
    autoAgreeJoinGroupUserNumForNormalGroup: number
    cmdUinFlagExt3Grocery: number
    groupCardPrefix: {
      introduction: string
      rptPrefix: string[]
    }
    groupExt: {
      groupInfoExtSeq: number
      reserve: number
      luckyWordId: string
      lightCharNum: number
      luckyWord: string
      starId: number
      essentialMsgSwitch: number
      todoSeq: number
      blacklistExpireTime: number
      isLimitGroupRtc: number
      companyId: number
      hasGroupCustomPortrait: number
      bindGuildId: string
      groupOwnerId: {
        memberUin: string
        memberUid: string
        memberQid: string
      }
      essentialMsgPrivilege: number
      msgEventSeq: string
      inviteRobotSwitch: number
      gangUpId: string
      qqMusicMedalSwitch: number
      showPlayTogetherSwitch: number
      groupFlagPro1: string
      groupBindGuildIds: {
        guildIds: string[]
      }
      viewedMsgDisappearTime: string
      groupExtFlameData: {
        switchState: number
        state: number
        dayNums: number[]
        version: number
        updateTime: string
        isDisplayDayNum: boolean
      }
      groupBindGuildSwitch: number
      groupAioBindGuildId: string
      groupExcludeGuildIds: {
        guildIds: string[]
      }
      fullGroupExpansionSwitch: number
      fullGroupExpansionSeq: string
      inviteRobotMemberSwitch: number
      inviteRobotMemberExamine: number
      groupSquareSwitch: number
      msgLimitFrequency: number
      hlGuildAppid: number
      hlGuildSubType: number
      isAllowRecallMsg: number
      confUin: string
      confMaxMsgSeq: number
      confToGroupTime: number
      groupSchoolInfo: {
        location: string
        grade: number
        school: string
      }
      activeMemberNum: number
      groupGrade: number
      groupCreateTime: number
      subscriptionUin: string
      subscriptionUid: string
      noFingerOpenFlag: number
      noCodeFingerOpenFlag: number
      isGroupFreeze: number
      allianceId: string
      groupExtOnly: {
        tribeId: number
        moneyForAddGroup: number
      }
      isAllowConfGroupMemberModifyGroupName: number
      isAllowConfGroupMemberNick: number
      isAllowConfGroupMemberAtAll: number
      groupClassText: string
      groupFreezeReason: number
      headPortraitSeq: number
      groupHeadPortrait: {
        portraitCnt: number
        portraitInfo: unknown[]
        defaultId: number
        verifyingPortraitCnt: number
        verifyingPortraitInfo: unknown[]
      }
      cmdUinJoinMsgSeq: number
      cmdUinJoinRealMsgSeq: number
      groupAnswer: string
      groupAdminMaxNum: number
      inviteNoAuthNumLimit: string
      hlGuildOrgId: number
      isAllowHlGuildBinary: number
      localExitGroupReason: number
    }
  }) => boolean

  /**
   * 群组所有信息变化时触发
   */
  onGroupAllInfoChange: (p1: {
    groupCode: string
    ownerUid: string
    groupFlag: number
    groupFlagExt: number
    maxMemberNum: number
    memberNum: number
    groupOption: number
    classExt: number
    groupName: string
    fingerMemo: string
    groupQuestion: string
    certType: number
    shutUpAllTimestamp: number
    shutUpMeTimestamp: number
    groupTypeFlag: number
    privilegeFlag: number
    groupSecLevel: number
    groupFlagExt3: number
    isConfGroup: number
    isModifyConfGroupFace: number
    isModifyConfGroupName: number
    noFigerOpenFlag: number
    noCodeFingerOpenFlag: number
    groupFlagExt4: number
    groupMemo: string
    cmdUinMsgSeq: number
    cmdUinJoinTime: number
    cmdUinUinFlag: number
    cmdUinMsgMask: number
    groupSecLevelInfo: number
    cmdUinPrivilege: number
    cmdUinFlagEx2: number
    appealDeadline: number
    remarkName: string
    isTop: boolean
    richFingerMemo: string
    groupAnswer: string
    joinGroupAuth: string
    isAllowModifyConfGroupName: number
  }) => boolean

  /**
   * 群组消息屏蔽结果时触发
   */
  onGroupsMsgMaskResult: () => void

  /**
   * 群组成员变化时触发
   */
  onGroupConfMemberChange: () => void

  /**
   * 群组公告变化时触发
   */
  onGroupBulletinChange: () => void

  /**
   * 群组公告已读用户结果时触发
   */
  onGroupBulletinReadUserResult: () => void

  /**
   * 获取群组公告列表结果时触发
   */
  onGetGroupBulletinListResult: () => void

  /**
   * 获取群组公告详细结果时触发
   */
  onGetGroupBulletinDetailResult: () => void

  /**
   * 成员列表变化时触发
   */
  onMemberListChange: (p1: {
    sceneId: string
    groupCode: string
    ids: {
      uid: string
      index: number
    }[]
    infos: Map<
      string,
      {
        uid: string
        qid: string
        uin: string
        nick: string
        remark: string
        cardType: number
        cardName: string
        role: number
        avatarPath: string
        shutUpTime: number
        isDelete: boolean
        isSpecialConcerned: boolean
        isSpecialShield: boolean
        isRobot: boolean
        groupHonor: Uint8Array
        memberRealLevel: number
        memberLevel: number
        globalGroupLevel: number
        globalGroupPoint: number
        memberTitleId: number
        memberSpecialTitle: string
        specialTitleExpireTime: string
        userShowFlag: number
        userShowFlagNew: number
        richFlag: number
        mssVipType: number
        bigClubLevel: number
        bigClubFlag: number
        autoRemark: string
        creditLevel: number
        joinTime: number
        lastSpeakTime: number
        memberFlag: number
        memberFlagExt: number
        memberMobileFlag: number
        memberFlagExt2: number
        isSpecialShielded: boolean
        cardNameId: number
      }
    >
    hasPrev: boolean
    hasNext: boolean
    hasRobot: boolean
  }) => boolean

  /**
   * 成员信息变化时触发
   */
  onMemberInfoChange: (
    p1: string,
    p2: number,
    p3: Map<
      string,
      {
        uid: string
        qid: string
        uin: string
        nick: string
        remark: string
        cardType: number
        cardName: string
        role: number
        avatarPath: string
        shutUpTime: number
        isDelete: false
        isSpecialConcerned: false
        isSpecialShield: false
        isRobot: false
        groupHonor: Uint8Array
        memberRealLevel: number
        memberLevel: number
        globalGroupLevel: number
        globalGroupPoint: number
        memberTitleId: number
        memberSpecialTitle: string
        specialTitleExpireTime: string
        userShowFlag: number
        userShowFlagNew: number
        richFlag: number
        mssVipType: number
        bigClubLevel: number
        bigClubFlag: number
        autoRemark: string
        creditLevel: number
        joinTime: number
        lastSpeakTime: number
        memberFlag: number
        memberFlagExt: number
        memberMobileFlag: number
        memberFlagExt2: number
        isSpecialShielded: boolean
        cardNameId: number
      }
    >
  ) => boolean

  /**
   * 搜索成员变化时触发
   */
  onSearchMemberChange: () => void

  /**
   * 群组公告富媒体下载完成时触发
   */
  onGroupBulletinRichMediaDownloadComplete: () => void

  /**
   * 群组公告富媒体下载进度更新时触发
   */
  onGroupBulletinRichMediaProgressUpdate: () => void

  /**
   * 群组统计信息变化时触发
   */
  onGroupStatisticInfoChange: () => void

  /**
   * 加入群组通知时触发
   */
  onJoinGroupNotify: () => void

  /**
   * 群组成员禁言列表变化时触发
   */
  onShutUpMemberListChanged: () => void

  /**
   * 群组公告提醒通知时触发
   */
  onGroupBulletinRemindNotify: () => void

  /**
   * 群组第一次公告通知时触发
   */
  onGroupFirstBulletinNotify: () => void

  /**
   * 加入群组时无验证标志触发
   */
  onJoinGroupNoVerifyFlag: () => void

  /**
   * 群组邀请状态结果时触发
   */
  onGroupArkInviteStateResult: () => void

  /**
   * 群组成员等级信息变化时触发
   */
  onGroupMemberLevelInfoChange: () => void

  /**
   * 群组添加时触发
   */
  onGroupAdd: () => void

  /**
   * 群组精华列表变化时触发
   */
  onGroupEssenceListChange: () => void
}

export interface NodeIKernelGroupService {
  /**
   * 注册一个监听器，用于接收群组相关的事件通知。
   * @param listener - 事件监听器函数
   */
  addKernelGroupListener: (listener: KernelGroupListener) => void

  /**
   * 移除已注册的群组事件监听器。
   * @param listener - 要移除的事件监听器函数
   */
  removeKernelGroupListener: (listener: KernelGroupListener) => void

  /**
   * 获取所有成员列表。
   * @returns - 返回群组的所有成员信息
   */
  getAllMemberList: () => any[]

  /**
   * 获取成员的公共信息。
   * @param memberId - 成员的唯一标识符
   * @returns - 返回成员的公共信息
   */
  getMemberCommonInfo: (memberId: string) => any

  /**
   * 获取成员的扩展信息。
   * @param memberId - 成员的唯一标识符
   * @returns - 返回成员的扩展信息
   */
  getMemberExtInfo: (memberId: string) => any

  /**
   * 获取成员的 MQQ 信息。
   * @param memberId - 成员的唯一标识符
   * @returns - 返回成员的 MQQ 信息
   */
  getMemberInfoForMqq: (memberId: string) => any

  /**
   * 创建成员列表场景。
   * @returns - 返回场景的标识符
   */
  createMemberListScene: () => string

  /**
   * 销毁成员列表场景。
   * @param sceneId - 场景的唯一标识符
   */
  destroyMemberListScene: (sceneId: string) => void

  /**
   * 获取下一页的成员列表。
   * @param sceneId - 场景的唯一标识符
   * @returns - 返回下一页的成员信息
   */
  getNextMemberList: (sceneId: string) => any[]

  /**
   * 获取上一页的成员列表。
   * @param sceneId - 场景的唯一标识符
   * @returns - 返回上一页的成员信息
   */
  getPrevMemberList: (sceneId: string) => any[]

  /**
   * 监控成员列表的变化。
   * @param sceneId - 场景的唯一标识符
   */
  monitorMemberList: (sceneId: string) => void

  /**
   * 搜索成员。
   * @param query - 搜索关键字
   * @returns - 返回匹配的成员列表
   */
  searchMember: (query: string) => any[]

  /**
   * 获取成员的详细信息。
   * @param memberId - 成员的唯一标识符
   * @returns - 返回成员的详细信息
   */
  getMemberInfo: (p1: string, p2: [string], p3: boolean) => WrapperAsyncResponse

  /**
   * 获取缓存的成员信息。
   * @param memberId - 成员的唯一标识符
   * @returns - 返回缓存的成员信息
   */
  getMemberInfoCache: (memberId: string) => any

  /**
   * 踢出群组成员。
   * @param memberId - 被踢出的成员的唯一标识符
   */
  kickMember: (memberId: string) => void

  /**
   * 踢出群组成员（版本2）。
   * @param memberId - 被踢出的成员的唯一标识符
   */
  kickMemberV2: (memberId: string) => void

  /**
   * 修改群组成员的角色。
   * @param memberId - 成员的唯一标识符
   * @param role - 新角色
   */
  modifyMemberRole: (memberId: string, role: string) => void

  /**
   * 修改群组成员的备注名。
   * @param memberId - 成员的唯一标识符
   * @param remark - 新备注名
   */
  modifyMemberCardName: (memberId: string, remark: string) => void

  /**
   * 获取可转让的成员信息。
   * @returns - 返回可转让的成员信息
   */
  getTransferableMemberInfo: () => any

  /**
   * 转让群组。
   * @param newOwnerId - 新群主的唯一标识符
   */
  transferGroup: (newOwnerId: string) => void

  /**
   * 转让群组（版本2）。
   * @param newOwnerId - 新群主的唯一标识符
   */
  transferGroupV2: (newOwnerId: string) => void

  /**
   * 获取群组列表。
   * @returns - 返回群组的列表
   */
  getGroupList: () => any[]

  /**
   * 获取群组的扩展列表。
   * @returns - 返回群组的扩展信息列表
   */
  getGroupExtList: () => any[]

  /**
   * 获取群组扩展信息 0xEF0。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回扩展信息
   */
  getGroupExt0xEF0Info: (groupId: string) => any

  /**
   * 获取群组详细信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组详细信息
   */
  getGroupDetailInfo: (groupId: string) => any

  /**
   * 获取群组的所有信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组的所有信息
   */
  getGroupAllInfo: (groupId: string) => any

  /**
   * 获取 MQQ 的群组详细信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组的详细信息
   */
  getGroupDetailInfoForMqq: (groupId: string) => any

  /**
   * 根据过滤条件获取群组详细信息。
   * @param groupId - 群组的唯一标识符
   * @param filter - 过滤条件
   * @returns - 返回群组的详细信息
   */
  getGroupDetailInfoByFilter: (groupId: string, filter: any) => any

  /**
   * 获取讨论组的存在信息。
   * @param discussId - 讨论组的唯一标识符
   * @returns - 返回讨论组的存在信息
   */
  getDiscussExistInfo: (discussId: string) => any

  /**
   * 获取群组的成员配置信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回成员配置的信息
   */
  getGroupConfMember: (groupId: string) => any

  /**
   * 获取群组消息屏蔽设置。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组的消息屏蔽设置
   */
  getGroupMsgMask: (groupId: string) => any

  /**
   * 获取群组头像。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组的头像信息
   */
  getGroupPortrait: (groupId: string) => any

  /**
   * 修改群组名称。
   * @param groupId - 群组的唯一标识符
   * @param name - 新群组名称
   */
  modifyGroupName: (groupId: string, name: string) => void

  /**
   * 修改群组备注。
   * @param groupId - 群组的唯一标识符
   * @param remark - 新备注
   */
  modifyGroupRemark: (groupId: string, remark: string) => void

  /**
   * 修改群组的详细信息。
   * @param groupId - 群组的唯一标识符
   * @param detailInfo - 新的详细信息
   */
  modifyGroupDetailInfo: (groupId: string, detailInfo: any) => void

  /**
   * 修改群组的详细信息（版本2）。
   * @param groupId - 群组的唯一标识符
   * @param detailInfo - 新的详细信息
   */
  modifyGroupDetailInfoV2: (groupId: string, detailInfo: any) => void

  /**
   * 设置群组消息屏蔽。
   * @param groupId - 群组的唯一标识符
   * @param mask - 消息屏蔽设置
   */
  setGroupMsgMask: (groupId: string, mask: any) => void

  /**
   * 设置群组消息屏蔽（版本2）。
   * @param groupId - 群组的唯一标识符
   * @param mask - 消息屏蔽设置
   */
  setGroupMsgMaskV2: (groupId: string, mask: any) => void

  /**
   * 临时改变群组屏蔽设置。
   * @param groupId - 群组的唯一标识符
   * @param setting - 新的屏蔽设置
   */
  changeGroupShieldSettingTemp: (groupId: string, setting: any) => void

  /**
   * 邀请成员加入群组。
   * @param memberId - 被邀请的成员的唯一标识符
   * @param groupId - 群组的唯一标识符
   */
  inviteToGroup: (memberId: string, groupId: string) => void

  /**
   * 邀请成员加入群组（版本2）。
   * @param memberId - 被邀请的成员的唯一标识符
   * @param groupId - 群组的唯一标识符
   */
  inviteToGroupV2: (memberId: string, groupId: string) => void

  /**
   * 邀请多个成员加入群组。
   * @param memberIds - 被邀请的成员唯一标识符数组
   * @param groupId - 群组的唯一标识符
   */
  inviteMembersToGroup: (memberIds: string[], groupId: string) => void

  /**
   * 邀请多个成员加入群组并发送消息。
   * @param memberIds - 被邀请的成员唯一标识符数组
   * @param groupId - 群组的唯一标识符
   * @param message - 发送的消息
   */
  inviteMembersToGroupWithMsg: (memberIds: string[], groupId: string, message: string) => void

  /**
   * 创建群组。
   * @param name - 群组名称
   * @returns - 返回新创建群组的唯一标识符
   */
  createGroup: (name: string) => string

  /**
   * 创建群组并指定成员。
   * @param name - 群组名称
   * @param memberIds - 成员唯一标识符数组
   * @returns - 返回新创建群组的唯一标识符
   */
  createGroupWithMembers: (name: string, memberIds: string[]) => string

  /**
   * 创建群组（版本2）。
   * @param name - 群组名称
   * @returns - 返回新创建群组的唯一标识符
   */
  createGroupV2: (name: string) => string

  /**
   * 退出群组。
   * @param groupId - 群组的唯一标识符
   */
  quitGroup: (groupId: string) => void

  /**
   * 退出群组（版本2）。
   * @param groupId - 群组的唯一标识符
   */
  quitGroupV2: (groupId: string) => void

  /**
   * 解散群组。
   * @param groupId - 群组的唯一标识符
   */
  destroyGroup: (groupId: string) => void

  /**
   * 解散群组（版本2）。
   * @param groupId - 群组的唯一标识符
   */
  destroyGroupV2: (groupId: string) => void

  /**
   * 获取单屏通知。
   * @returns - 返回单屏通知的信息
   */
  getSingleScreenNotifies: () => any[]

  /**
   * 清除群组通知。
   * @param groupId - 群组的唯一标识符
   */
  clearGroupNotifies: (groupId: string) => void

  /**
   * 获取群组未读通知数量。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回未读通知的数量
   */
  getGroupNotifiesUnreadCount: (groupId: string) => number

  /**
   * 清除群组未读通知数量。
   * @param groupId - 群组的唯一标识符
   */
  clearGroupNotifiesUnreadCount: (groupId: string) => void

  /**
   * 操作系统通知。
   * @param notificationId - 通知的唯一标识符
   */
  operateSysNotify: (notificationId: string) => void

  /**
   * 设置群组置顶。
   * @param groupId - 群组的唯一标识符
   * @param isTop - 是否置顶的布尔值
   */
  setTop: (groupId: string, isTop: boolean) => void

  /**
   * 获取群组公告。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组公告的信息
   */
  getGroupBulletin: (groupId: string) => any

  /**
   * 删除群组公告。
   * @param bulletinId - 公告的唯一标识符
   */
  deleteGroupBulletin: (bulletinId: string) => void

  /**
   * 发布群组公告。
   * @param groupId - 群组的唯一标识符
   * @param bulletin - 公告内容
   */
  publishGroupBulletin: (groupId: string, bulletin: string) => void

  /**
   * 发布新成员的入群说明。
   * @param groupId - 群组的唯一标识符
   * @param instruction - 入群说明内容
   */
  publishInstructionForNewcomers: (groupId: string, instruction: string) => void

  /**
   * 上传群组公告图片。
   * @param image - 图片文件
   * @returns - 返回上传结果的对象
   */
  uploadGroupBulletinPic: (image: File) => any

  /**
   * 下载群组公告的富媒体。
   * @param bulletinId - 公告的唯一标识符
   * @returns - 返回下载结果的对象
   */
  downloadGroupBulletinRichMedia: (bulletinId: string) => any

  /**
   * 获取群组公告列表。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组公告的列表
   */
  getGroupBulletinList: (groupId: string) => any[]

  /**
   * 获取群组公告详细信息。
   * @param bulletinId - 公告的唯一标识符
   * @returns - 返回群组公告的详细信息
   */
  getGroupBulletinDetail: (bulletinId: string) => any

  /**
   * 提醒群组公告已读。
   * @param bulletinId - 公告的唯一标识符
   */
  remindGroupBulletinRead: (bulletinId: string) => void

  /**
   * 获取已读群组公告的用户列表。
   * @param bulletinId - 公告的唯一标识符
   * @returns - 返回已读用户的列表
   */
  getGroupBulletinReadUsers: (bulletinId: string) => any[]

  /**
   * 获取群组统计信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组的统计信息
   */
  getGroupStatisticInfo: (groupId: string) => any

  /**
   * 获取群组的剩余@次数。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回剩余@次数
   */
  getGroupRemainAtTimes: (groupId: string) => number

  /**
   * 获取加入群组时的无需验证标志。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回是否无需验证的布尔值
   */
  getJoinGroupNoVerifyFlag: (groupId: string) => boolean

  /**
   * 获取群组邀请状态。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组邀请的状态
   */
  getGroupArkInviteState: (groupId: string) => any

  /**
   * 申请加入群组。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回申请结果的对象
   */
  reqToJoinGroup: (groupId: string) => any

  /**
   * 加入群组。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回加入结果的对象
   */
  joinGroup: (groupId: string) => any

  /**
   * 设置群组头像。
   * @param groupId - 群组的唯一标识符
   * @param avatar - 新头像
   */
  setHeader: (groupId: string, avatar: File) => void

  /**
   * 设置群组成员禁言。
   * @param memberId - 成员的唯一标识符
   * @param duration - 禁言时长（秒）
   */
  setGroupShutUp: (memberId: string, duration: number) => void

  /**
   * 获取群组的禁言成员列表。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回禁言成员的列表
   */
  getGroupShutUpMemberList: (groupId: string) => any[]

  /**
   * 设置成员禁言。
   * @param memberId - 成员的唯一标识符
   * @param duration - 禁言时长（秒）
   */
  setMemberShutUp: (memberId: string, duration: number) => void

  /**
   * 获取群组推荐联系人。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回推荐联系人的 JSON 信息
   */
  getGroupRecommendContactArkJson: (groupId: string) => any

  /**
   * 获取加入群组的链接。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回加入链接
   */
  getJoinGroupLink: (groupId: string) => string

  /**
   * 修改群组扩展信息。
   * @param groupId - 群组的唯一标识符
   * @param extInfo - 新的扩展信息
   */
  modifyGroupExtInfo: (groupId: string, extInfo: any) => void

  /**
   * 修改群组扩展信息（版本2）。
   * @param groupId - 群组的唯一标识符
   * @param extInfo - 新的扩展信息
   */
  modifyGroupExtInfoV2: (groupId: string, extInfo: any) => void

  /**
   * 操作特殊关注列表。
   * @param action - 操作类型
   * @param memberId - 成员的唯一标识符
   */
  operateSpecialFocus: (action: string, memberId: string) => void

  /**
   * 获取群组推荐联系人到微信的 JSON 信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回推荐联系人的 JSON 信息
   */
  getGroupRecommendContactArkJsonToWechat: (groupId: string) => any

  /**
   * 获取群组的数据库版本。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回数据库版本信息
   */
  getGroupDBVersion: (groupId: string) => any

  /**
   * 获取群组的荣誉列表。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组荣誉列表
   */
  getGroupHonorList: (groupId: string) => any[]

  /**
   * 根据用户唯一标识符获取用户 ID。
   * @param uids - 用户唯一标识符数组
   * @returns - 返回用户 ID 的映射
   */
  getUidByUins: (uids: string[]) => any

  /**
   * 根据用户 ID 获取用户唯一标识符。
   * @param uids - 用户 ID 数组
   * @returns - 返回用户唯一标识符的映射
   */
  getUinByUids: (uids: string[]) => any

  /**
   * 检查群组成员缓存。
   * @param memberId - 成员的唯一标识符
   * @returns - 返回成员缓存的状态
   */
  checkGroupMemberCache: (memberId: string) => boolean

  /**
   * 将群组关系设置为公会。
   * @param groupId - 群组的唯一标识符
   * @param guildId - 公会的唯一标识符
   */
  setGroupRelationToGuild: (groupId: string, guildId: string) => void

  /**
   * 获取群组绑定的公会列表。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回绑定公会的列表
   */
  getGroupBindGuilds: (groupId: string) => any[]

  /**
   * 解除所有公会的绑定。
   * @param groupId - 群组的唯一标识符
   */
  unbindAllGuilds: (groupId: string) => void

  /**
   * 设置 AIO 绑定的公会。
   * @param groupId - 群组的唯一标识符
   * @param guildId - 公会的唯一标识符
   */
  setAIOBindGuild: (groupId: string, guildId: string) => void

  /**
   * 查询 AIO 绑定的公会。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回绑定的公会信息
   */
  queryAIOBindGuild: (groupId: string) => any

  /**
   * 获取 AIO 绑定的公会信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回绑定的公会信息
   */
  getAIOBindGuildInfo: (groupId: string) => any

  /**
   * 根据 MQQ 更新成员信息。
   * @param memberId - 成员的唯一标识符
   */
  updateMemberInfoByMqq: (memberId: string) => void

  /**
   * 从群组列表中移除群组。
   * @param groupId - 群组的唯一标识符
   */
  removeGroupFromGroupList: (groupId: string) => void

  /**
   * 获取子群组信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回子群组的信息
   */
  getSubGroupInfo: (groupId: string) => any

  /**
   * 查询加入群组是否无需验证。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回是否无需验证的布尔值
   */
  queryJoinGroupCanNoVerify: (groupId: string) => boolean

  /**
   * 设置活动扩展群组。
   * @param groupId - 群组的唯一标识符
   */
  setActiveExtGroup: (groupId: string) => void

  /**
   * 设置接收加入验证消息。
   * @param groupId - 群组的唯一标识符
   * @param enable - 是否启用
   */
  setRcvJoinVerifyMsg: (groupId: string, enable: boolean) => void

  /**
   * 设置群组地理信息。
   * @param groupId - 群组的唯一标识符
   * @param geoInfo - 地理信息
   */
  setGroupGeoInfo: (groupId: string, geoInfo: any) => void

  /**
   * 根据 MQQ 更新群组信息。
   * @param groupId - 群组的唯一标识符
   */
  updateGroupInfoByMqq: (groupId: string) => void

  /**
   * 获取所有群组权限标志。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回权限标志
   */
  getAllGroupPrivilegeFlag: (groupId: string) => any

  /**
   * 获取精华消息的开关状态。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回精华消息的开关状态
   */
  getSwitchStatusForEssenceMsg: (groupId: string) => any

  /**
   * 获取群组成员最大数量。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回最大成员数量
   */
  getGroupMemberMaxNum: (groupId: string) => number

  /**
   * 获取群组的安全级别信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回安全级别信息
   */
  getGroupSecLevelInfo: (groupId: string) => any

  /**
   * 获取群组的头像墙。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组头像墙的信息
   */
  getGroupAvatarWall: (groupId: string) => any

  /**
   * 获取群组的序列号和加入时间。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回序列号和加入时间
   */
  getGroupSeqAndJoinTimeForGrayTips: (groupId: string) => any

  /**
   * 获取加入群组的信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回加入群组的信息
   */
  getGroupInfoForJoinGroup: (groupId: string) => any

  /**
   * 获取群组加入时的付费状态。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回付费状态
   */
  getGroupPayToJoinStatus: (groupId: string) => any

  /**
   * 获取群组消息限制频率。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回消息限制频率
   */
  getGroupMsgLimitFreq: (groupId: string) => any

  /**
   * 获取群组标签记录。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回群组标签记录
   */
  getGroupTagRecords: (groupId: string) => any[]

  /**
   * 获取第三方应用的群组标志。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回第三方应用的群组标志
   */
  getGroupFlagForThirdApp: (groupId: string) => any

  /**
   * 获取群组邀请无权限限制的数量。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回数量
   */
  getGroupInviteNoAuthLimitNum: (groupId: string) => number

  /**
   * 获取群组最新的精华消息列表。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回最新的精华消息列表
   */
  getGroupLatestEssenceList: (groupId: string) => any[]

  /**
   * 添加群组精华消息。
   * @param messageId - 精华消息的唯一标识符
   */
  addGroupEssence: (messageId: string) => void

  /**
   * 移除群组精华消息。
   * @param messageId - 精华消息的唯一标识符
   */
  removeGroupEssence: (messageId: string) => void

  /**
   * 获取群组成员的等级信息。
   * @param groupId - 群组的唯一标识符
   * @returns - 返回成员等级信息
   */
  getGroupMemberLevelInfo: (groupId: string) => any

  /**
   * 指示消息是否为精华消息。
   * @type {boolean}
   */
  isEssenceMsg?: boolean

  /**
   * 查询缓存的精华消息。
   * @returns {Promise<unknown[]>} 返回一个 Promise，解析为精华消息的数组。
   */
  queryCachedEssenceMsg?: () => Promise<undefined[]>

  /**
   * 分享群组的摘要。
   * @returns {Promise<void>} 返回一个 Promise，当摘要分享完成时解析。
   */
  shareDigest?: () => Promise<void>

  /**
   * 获取群组的精华列表。
   * @returns {Promise<EssenceList>} 返回一个 Promise，解析为群组的精华列表。
   */
  fetchGroupEssenceList?: () => Promise<unknown>
}
