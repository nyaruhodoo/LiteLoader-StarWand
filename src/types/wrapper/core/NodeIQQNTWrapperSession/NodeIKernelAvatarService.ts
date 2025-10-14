interface AvatarListener {
  /**
   * 当用户头像发生变化时调用的回调函数
   */
  onAvatarChanged: () => void

  /**
   * 当群组头像发生变化时调用的回调函数
   */
  onGroupAvatarChanged: () => void

  /**
   * 当群组的头像（群组图标）发生变化时调用的回调函数
   */
  onGroupPortraitChanged: () => void

  /**
   * 当特定用户（通过 UIN）头像发生变化时调用的回调函数
   */
  onAvatarChangedForUin: () => void
}

export interface NodeIKernelAvatarService {
  addAvatarListener: (listener: AvatarListener) => string
  removeAvatarListener: (listener: AvatarListener) => string
  getAvatarPath: (p1: string, p2: number) => string
  forceDownloadAvatar: (uid: string) => Promise<void>
  getGroupAvatarPath: (groupId: string) => string
  getConfGroupAvatarPath: (confId: string) => string
  forceDownloadGroupAvatar: (groupId: string) => Promise<void>
  getGroupPortraitPath: (groupId: string) => string
  forceDownloadGroupPortrait: (groupId: string) => Promise<void>
  getAvatarPaths: (uids: string[]) => string[]
  getGroupAvatarPaths: (groupIds: string[]) => string[]
  getConfGroupAvatarPaths: (confIds: string[]) => string[]
  getAvatarPathByUin: (uin: string) => string
  forceDownloadAvatarByUin: (uin: string) => Promise<void>
}
