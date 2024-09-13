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

  //----------------- * IPC 部分 * -----------------

  // 收到新消息(只会收到已激活窗口消息)
  onRecvActiveMsg = 'nodeIKernelMsgListener/onRecvActiveMsg'
}
