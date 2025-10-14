interface LockListener {
  /**
   * 当锁状态发生变化时调用的回调函数
   */
  onLockStatusChange: () => void
}

export interface NodeIKernelLockService {
  /**
   * 注册一个锁监听器，当锁状态发生变化时触发。
   * @param listener - 一个回调函数，当锁状态改变时调用。
   */
  addKernelLockListener: (listener: LockListener) => void

  /**
   * 移除已注册的锁监听器。
   * @param listener - 需要移除的监听器回调函数。
   */
  removeKernelLockListener: (listener: LockListener) => void

  /**
   * 解锁桌面QQ，使其可在移动设备上使用。
   */
  unlockDesktopQQToMobile: () => void

  /**
   * 锁定桌面QQ，防止其在移动设备上使用。
   */
  lockDesktopQQ: () => void
}
