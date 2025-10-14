/**
 * Node杂项服务事件监听器接口，用于处理与杂项服务相关的各种事件。
 */
interface KernelNodeMiscListener {
  /**
   * 登录完成时触发
   */
  onLoginFinish: () => void

  /**
   * 主窗口操作事件触发
   */
  onMainWindowAction: () => void

  /**
   * QQ关闭后隐藏UI时触发
   */
  onQQCloseThenHideUi: () => void

  /**
   * QQ关闭后关闭UI时触发
   */
  onQQCloseThenCloseUi: () => void

  /**
   * QQ关闭后退出程序时触发
   */
  onQQCloseThenExit: () => void

  /**
   * QQ发送按键按钮更改时触发
   */
  onQQChangeSendKeyButton: () => void

  /**
   * QQ截图完成时触发
   */
  onQQScreenShotComplete: () => void

  /**
   * QQ屏幕录制完成时触发
   */
  onQQScreenRecordingComplete: () => void

  /**
   * QQ截图完成 (新工具) 时触发
   */
  onQQScreenShotCompleteNT: () => void

  /**
   * QQ屏幕录制完成 (新工具) 时触发
   */
  onQQScreenRecordingCompleteNT: () => void

  /**
   * QQ屏幕OCR开始时触发
   */
  onQQScreenOCRBegin: () => void

  /**
   * QQ屏幕OCR完成时触发
   */
  onQQScreenOCRComplete: () => void

  /**
   * QQ公共屏幕OCR完成时触发
   */
  onQQScreenOCRPublicComplete: () => void

  /**
   * QQ截图工具报告时触发
   */
  onQQScreenShotToolReport: () => void

  /**
   * QQ屏幕代理连接时触发
   */
  onQQScreenAgentConnected: () => void

  /**
   * QQ屏幕代理断开连接时触发
   */
  onQQScreenAgentDisConnected: () => void

  /**
   * 在Catalina中检查录制是否已记录时触发
   */
  onQQScreenCheckRecordInInCatalina: () => void

  /**
   * QQ屏幕注册快捷键时触发
   */
  onQQScreenRegisterShortCut: () => void

  /**
   * QQ屏幕版本不可用检查失败时触发
   */
  onQQScreenCheckVersionAvailableFail: () => void

  /**
   * QQ屏幕长截图事件触发
   */
  onQQScreenLongCaptureEvent: () => void

  /**
   * 显示QQ屏幕位图时触发
   */
  onQQScreenDisplayBitmaps: () => void

  /**
   * 显示QQ屏幕URL时触发
   */
  onQQScreenDisplayUrl: () => void

  /**
   * 获取QQ屏幕窗口信息时触发
   */
  onQQScreenWindowsInfo: () => void

  /**
   * QQ屏幕检测结果时触发
   */
  onQQScreenDetectResult: () => void

  /**
   * QQ长截图完成 (新工具) 时触发
   */
  onQQScreenLongShotCompleteNT: () => void

  /**
   * 接收QQ屏幕事件时触发
   */
  onQQScreenReceiveEvent: () => void

  /**
   * 显示主面板时触发
   */
  onQQShowMainPanel: () => void

  /**
   * 获取重新启动参数时触发
   */
  onGetRelaunchParams: () => void

  /**
   * 获取跳转公会信息时触发
   */
  onGetJumpGuild: () => void

  /**
   * 检查是否有可用的Sidecar设备时触发
   */
  oncheckIfHaveAvailableSidecarDevice: () => void

  /**
   * 从Sidecar获取数据时触发
   */
  onGetDataFromSidecar: () => void

  /**
   * 截图工具报告（新工具）时触发
   */
  onScreenShotToolReportNT: () => void

  /**
   * 接收到小程序消息时触发
   */
  onRecvMiniAppMsg: () => void

  /**
   * 小程序连接时触发
   */
  onMiniAppConnected: () => void

  /**
   * 小程序断开连接时触发
   */
  onMiniAppDisconnected: () => void

  /**
   * 小程序下载完成时触发
   */
  onMiniAppDownloadComplete: () => void

  /**
   * 小程序下载进度更新时触发
   */
  onMininAppDownloadProgress: () => void

  /**
   * 小游戏下载完成时触发
   */
  onMiniGameDownloadComplete: () => void

  /**
   * 小游戏下载进度更新时触发
   */
  onMininGameDownloadProgress: () => void
}

export interface NodeIKernelNodeMiscService {
  addKernelNodeMiscListener: (listener: KernelNodeMiscListener) => void // 根据实际事件类型替换 `any`
  removeKernelNodeMiscListener: (listener: KernelNodeMiscListener) => void // 根据实际事件类型替换 `any`

  startSession: () => void // 启动会话
  encodeAES: (data: string, key: string) => string // 使用 AES 加密数据
  getUserDataDir: () => string // 获取用户数据目录
  setCurActiveGuildAndChannel: (guildId: string, channelId: string) => void // 设置当前活动公会和频道
  setCurWindowsStatus: (status: string) => void // 设置当前窗口状态
  sendLog: (message: string) => void // 发送日志

  openPictureUsingQQ: (picturePath: string) => void // 使用 QQ 打开图片
  initScreenShotPlugin: () => void // 初始化截图插件
  setScreenShotSetting: (settings: any) => void // 设置截图参数
  wantScreenShot: () => void // 请求截图
  wantScreenShotWithLinuxX11Lib: () => void // 使用 Linux X11 库请求截图
  wantScreenRecording: () => void // 请求屏幕录制
  startScreenShotInstance: () => void // 启动截图实例
  wantScreenShotNT: () => void // 请求 NT 系统截图
  wantScreenRecordingNT: () => void // 请求 NT 系统录制
  wantScreenOCR: () => void // 请求屏幕 OCR
  wantWinScreenOCR: () => void // 请求 Windows 屏幕 OCR
  cancelOCRImage: () => void // 取消 OCR 图像处理
  registerScreenRecordShortcutWithKeycode: (keycode: string) => void // 注册屏幕录制快捷键
  registerScreenCaptureShortcutWithKeycode: (keycode: string) => void // 注册屏幕捕获快捷键
  unregisterHotkey: (keycode: string) => void // 注销热键
  isScreenCaptureOrRecording: () => boolean // 检查是否在捕获或录制
  getGetFullScreenInfo: () => {
    in_full_screen: boolean
    is_self: boolean
  } // 获取全屏信息
  getDisplayInfo: () => any // 获取显示信息
  getWindowsInfo: () => any // 获取窗口信息
  cleanWindowsInfo: () => void // 清理窗口信息
  getCurWindowInfo: () => any // 获取当前窗口信息
  setWindowPos: (x: number, y: number) => void // 设置窗口位置
  startScreenCaptureDetect: () => void // 启动屏幕捕获检测
  startScreenCaptureDetectByBuf: (buffer: ArrayBuffer) => void // 根据缓冲区启动屏幕捕获检测
  checkIsSupportAutoDetect: () => boolean // 检查是否支持自动检测
  startScreenCaptureLong: () => void // 开始长时间屏幕捕获
  setWindowLevelNT: (level: number) => void // 设置 NT 窗口级别
  callLongCaptureExit: () => void // 调用长时间捕获退出
  listenWindowEvents: () => void // 监听窗口事件
  unlistenWindowEvents: () => void // 取消监听窗口事件
  isDwmCompositionEnabled: () => boolean // 检查 DWM 组合是否启用
  deleteShareFile: (filePath: string) => void // 删除共享文件
  scanQBar: (qrCode: string) => void // 扫描二维码
  isAppInstalled: (appId: string) => boolean // 检查应用是否已安装
  installApp: (appId: string) => void // 安装应用
  startNewApp: (appId: string) => void // 启动新应用
  sendRequestToApiGateway: (request: any) => Promise<any> // 向 API 网关发送请求
  getOpenAuth: () => any // 获取开放认证信息
  getOpenAuthDelegateCode: () => string // 获取开放认证代理代码
  wantParseClipboard: () => void // 请求解析剪贴板
  writeBitmapToClipboard: (bitmap: any) => void // 将位图写入剪贴板
  mainWindowInitComplete: () => void // 主窗口初始化完成
  notifyGuildHasHiddenDock: (guildId: string) => void // 通知公会有隐藏的 dock
  changeSendKey: (newKey: string) => void // 更改发送键
  getSendKey: () => string // 获取发送键
  needRelaunchQQGuild: () => boolean // 检查是否需要重新启动 QQ 公会
  getNodeAndQQIPCVersions: () => { nodeVersion: string, qqIPCVersion: string } // 获取 Node 和 QQ IPC 版本
  getRelaunchParams: () => any // 获取重新启动参数
  writeClipboard: (p1: string) => WrapperAsyncResponse<{
    callId: string
  }> // 写入剪贴板
  checkIfHaveAvailableSidecarDevice: () => boolean // 检查是否有可用的侧车设备
  openSidecarMenu: () => void // 打开侧车菜单
  startNewAppInstance: (appId: string) => void // 启动新应用实例
  startNewMiniApp: (appId: string) => void // 启动新迷你应用
  sendMiniAppMsg: (message: any) => void // 发送迷你应用消息
  getAppInfoByLink: (link: string) => any // 根据链接获取应用信息
  setMiniAppVersion: (version: string) => void // 设置迷你应用版本
  getMiniAppPath: (appId: string) => string // 获取迷你应用路径
  isMiniAppExist: (appId: string) => boolean // 检查迷你应用是否存在
  isMiniAppAlreadyExist: (appId: string) => boolean // 检查迷你应用是否已经存在
  downloadMiniApp: (appId: string) => void // 下载迷你应用
  cancelDownloadMiniApp: (appId: string) => void // 取消下载迷你应用
  setMiniGameVersion: (version: string) => void // 设置迷你游戏版本
  getMiniGamePath: (gameId: string) => string // 获取迷你游戏路径
  isMiniGameExist: (gameId: string) => boolean // 检查迷你游戏是否存在
  isMiniGameAlreadyExist: (gameId: string) => boolean // 检查迷你游戏是否已经存在
  downloadMiniGame: (gameId: string) => void // 下载迷你游戏
  cancelDownloadMiniGame: (gameId: string) => void // 取消下载迷你游戏
  getMiniGameV2EngineConfig: () => any // 获取迷你游戏 V2 引擎配置
  openFileAndDirSelectDlg: () => void // 打开文件和目录选择对话框
  flashWindowInTaskbar: () => void // 在任务栏中闪烁窗口
  stopFlashWindow: () => void // 停止闪烁窗口
  registerSchemes: (scheme: string) => boolean // 注册方案
  writeVersionToRegistry: (version: string) => boolean // 将版本写入注册表
  setAutoRun: (enabled: boolean) => void // 设置开机自启
  delAutoRun: () => void // 删除开机自启
  queryAutoRun: () => boolean // 查询开机自启状态
  prefetch: () => void // 预取
  isOldQQRunning: () => boolean // 检查旧版 QQ 是否在运行
}
