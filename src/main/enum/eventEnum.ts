export const enum EventEnum {
  //----------------- * Wrapper 部分 * -----------------

  // QQ的日志
  sendLog = 'NodeIQQNTWrapperSession/create/getNodeMiscService/sendLog',

  // 登录成功，能拿到 uin,uid
  onQRCodeLoginSucceed = 'NodeIKernelLoginService/get/addKernelLoginListener/onQRCodeLoginSucceed',

  // 收到新消息
  onRecvMsg = 'NodeIQQNTWrapperSession/create/getMsgService/addKernelMsgListener/onRecvMsg',

  // 发送消息
  sendMsg = 'NodeIQQNTWrapperSession/create/getMsgService/sendMsg',

  // 广告?
  requestTianshuAdv = 'NodeIQQNTWrapperSession/create/getMsgService/requestTianshuAdv',

  // 获取个人信息
  onProfileSimpleChanged = 'NodeIQQNTWrapperSession/create/getProfileService/addKernelProfileListener/onProfileSimpleChanged',
  fetchUserDetailInfo = 'NodeIQQNTWrapperSession/create/getProfileService/fetchUserDetailInfo',
  onUserDetailInfoChanged = 'NodeIQQNTWrapperSession/create/getProfileService/addKernelProfileListener/onUserDetailInfoChanged',
  getVasInfo = 'NodeIQQNTWrapperSession/create/getProfileService/getVasInfo',

  // 设置主题，主要用于保存
  setThemeInfo = 'NodeIQQNTWrapperSession/create/getSkinService/setThemeInfo',
  // 真正设置主题的函数
  onThemeInfoChange = 'NodeIQQNTWrapperSession/create/getSkinService/addKernelSkinListener/onThemeInfoChange',
  // 能拿到颜色配置
  previewTheme = 'NodeIQQNTWrapperSession/create/getSkinService/previewTheme',
  // 获取全部主题
  getSystemThemePackageList = 'NodeIQQNTWrapperSession/create/getSkinService/getSystemThemePackageList',
  // 获取可DIY的其他主题
  getTemplateThemeList = 'NodeIQQNTWrapperSession/create/getSkinService/getTemplateThemeList',

  // 跳转外部链接时会调用
  checkMsgWithUrl = 'NodeIQQNTWrapperSession/create/getMsgService/checkMsgWithUrl',

  // 不清楚具体作用，会收集到ll相关信息
  onQQScreenWindowsInfo = 'NodeIQQNTWrapperSession/create/getNodeMiscService/addKernelNodeMiscListener/onQQScreenWindowsInfo',

  //----------------- * IPC 部分 * -----------------

  // 收到新消息(只会收到已激活窗口消息)
  onRecvActiveMsg = 'nodeIKernelMsgListener/onRecvActiveMsg'
}
