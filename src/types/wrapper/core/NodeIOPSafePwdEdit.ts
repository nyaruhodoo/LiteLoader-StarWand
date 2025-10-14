// 定义事件回调类型
interface KerneIOPSafePwdEditEventCallbacks {
  onPwdCtrlKeyEvent: (params: number) => boolean
}

export interface NodeIOPSafePwdEdit {
  // 添加和移除密码编辑监听器
  addOPSafePwdEditListener: (listener: KerneIOPSafePwdEditEventCallbacks) => void // 根据实际事件类型替换 `any`
  removeOPSafePwdEditListener: (listener: KerneIOPSafePwdEditEventCallbacks) => void // 根据实际事件类型替换 `any`

  // 初始化和加载
  init: (params: string) => boolean // 初始化
  LoadPwdSafeEdit: () => Promise<void> // 加载密码安全编辑器

  // 密码处理
  GetBufPwdHashOne: () => string // 获取缓冲密码哈希
  SetFocus: () => void // 设置焦点
  SetInputPos: (position: number) => void // 设置输入位置
  Softkeyborad: () => void // 显示软键盘
  ClearAllInput: () => void // 清除所有输入
  UnLoadPwdSafeEdit: () => void // 卸载密码安全编辑器
  IsSupportSafeEdit: () => boolean // 检查是否支持安全编辑
}
