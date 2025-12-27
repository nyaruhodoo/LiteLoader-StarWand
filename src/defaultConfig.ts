export interface ConfigType {
  minimumAmount: number
  randomDelay: {
    min: number
    max: number
  }
  redPackTextBlacklist: string
  groupBlacklist: string
  senderBlacklist: string
  skipPwd: boolean
  autoSendmsg: string
  devPort: number
}

export const defaultConfig: ConfigType = {
  minimumAmount: 200,
  randomDelay: {
    min: 2000,
    max: 4000,
  },
  redPackTextBlacklist: '挂&死&狗&测试',
  groupBlacklist: '',
  senderBlacklist: '',
  skipPwd: false,
  autoSendmsg: '谢谢',
  devPort: 3666,
}
