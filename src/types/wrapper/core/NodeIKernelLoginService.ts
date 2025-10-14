// 定义事件回调类型
interface KernelLoginEventCallbacks {
  onLoginConnected: () => boolean
  onLoginDisConnected: () => void
  onLoginConnecting: () => boolean
  onQRCodeGetPicture: () => void
  onQRCodeLoginPollingStarted: () => void
  onQRCodeSessionUserScaned: () => void
  onLoginState: () => void
  onQRCodeLoginSucceed: (userInfo: {
    account: string
    mainAccount: string
    uin: string
    uid: string
    nickName: ''
    gender: number
    age: number
    faceUrl: string
  }) => boolean
  onQRCodeSessionFailed: () => void
  onLoginFailed: () => void
  onLogoutSucceed: () => void
  onLogoutFailed: () => void
  onUserLoggedIn: () => void
  onQRCodeSessionQuickLoginFailed: () => void
  onPasswordLoginFailed: () => void
  OnConfirmUnusualDeviceFailed: () => void
  onQQLoginNumLimited: () => void
  onImportTicketsFromPCQQBegin: () => void
  onImportTicketsFromPCQQEnd: () => void
  onUnitedConfigUpdate: () => void
}

export interface NodeIKernelLoginService {
  // 添加和移除登录监听器
  addKernelLoginListener: (listener: KernelLoginEventCallbacks) => void // 根据实际事件类型替换 `any`
  removeKernelLoginListener: (listener: KernelLoginEventCallbacks) => void // 根据实际事件类型替换 `any`

  // 配置和初始化
  registerUnitedConfigPushGroupList: (groupList: any[]) => void // 根据实际类型替换 `any[]`
  initConfig: (config: {
    machineId: string
    appid: string
    platVer: string
    commonPath: string
    clientVer: string
    hostName: string
  }) => void // 根据实际配置类型替换 `any`

  // QR 码相关
  getQRCodePicture: () => Promise<string> // 返回 QR 码图片的 URL

  // 登录轮询
  startPolling: () => void // 启动轮询
  abortPolling: () => void // 中止轮询

  // 登录管理
  cancel: () => void // 取消登录
  destroy: () => void // 销毁服务实例
  connect: () => boolean // 连接服务
  getMsfStatus: () => number // 获取 Msf 状态
  getLoginMiscData: (params: string) => WrapperAsyncResponse // 获取登录杂项数据
  setLoginMiscData: (p1: string, p2: string) => WrapperAsyncResponse // 设置登录杂项数据
  passwordLogin: (username: string, password: string) => Promise<void> // 使用密码登录
  getLoginList: () => WrapperAsyncResponse<{
    LocalLoginInfoList: {
      uin: string // 用户 ID
      uid: string // 用户唯一标识符
      nickName: string // 用户昵称
      faceUrl: string // 头像 URL
      facePath: string // 本地头像路径
      loginType: number // 登录类型
      isQuickLogin: boolean // 是否是快速登录
      isAutoLogin: boolean // 是否是自动登录
    }[]
  }> // 获取登录列表
  deleteLoginInfo: (uin: string) => void // 删除登录信息
  resetLoginInfo: (uin: string) => void // 重置登录信息
  quickLoginWithUin: (uin: string) => Promise<void> // 使用 Uin 快速登录
  getMachineGuid: () => string // 获取机器 GUID
  loginUnusualDevice: (deviceInfo: any) => Promise<void> // 登录异常设备
  loadNoLoginUnitedConfig: () => void // 加载未登录的联合配置
  isHasLoginInfo: () => boolean // 检查是否有登录信息
}
