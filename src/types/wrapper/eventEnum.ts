/**
 * 其实这个 enum 并不是必须的，目前已经做了 wrapper 类型动态解析，不再需要手动拼接
 * 如果你不想在代码里写一大串莫名其妙的字符串那么还是建议统一维护，并且给出一些注释方便其他开发者
 */
export enum WrapperEventEnum {
  // QQ的日志
  sendLog = 'NodeIQQNTWrapperSession/getNTWrapperSession/getNodeMiscService/sendLog',

  // 登录成功，能拿到 uin,uid
  onQRCodeLoginSucceed = 'NodeIKernelLoginService/get/addKernelLoginListener/onQRCodeLoginSucceed',

  // 收到新消息
  onRecvMsg = 'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/addKernelMsgListener/onRecvMsg',

  // 发送消息
  sendMsg = 'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/sendMsg',

  // 更新
  fetchUnitedCommendConfig = 'NodeIQQNTWrapperSession/getNTWrapperSession/getUnitedConfigService/fetchUnitedCommendConfig',
}
