export interface ConfigType {
  clickNum: Record<string, number>
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
}

export const defaultConfig: ConfigType = {
  clickNum: {},
  minimumAmount: 200,
  randomDelay: {
    min: 2000,
    max: 5000,
  },
  redPackTextBlacklist: '挂&死&狗&测试',
  groupBlacklist: '',
  senderBlacklist: '',
  skipPwd: false,
  autoSendmsg: '谢谢',
}
