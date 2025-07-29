import { ElementType, type NodeIKernelMsgService } from 'napcat.core'
import { EventEnum } from '../enum/eventEnum'
import { wrapperEmitter } from '../hook/hookWrapper'
import { Utils } from '@/utils'

wrapperEmitter.addListener(
  EventEnum.sendMsg,
  async ({ args: sendMsg }: { args: Parameters<NodeIKernelMsgService['sendMsg']> }) => {
    const config = await Utils.getConfig()
    if (!config.clickNum) config.clickNum = {}

    for (const msg of sendMsg[2]) {
      if (msg.elementType !== ElementType.PIC || msg.picElement.picSubType !== 1) continue
      const md5 = msg.picElement.md5HexStr
      config.clickNum[md5] = (config.clickNum[md5] || 0) + 1
    }

    Utils.updateConfig(config)
  }
)

export const favEmojiInterceptors = {
  async 'NodeIQQNTWrapperSession/create/getMsgService/fetchFavEmojiList:response'(
    res: Promise<{
      emojiInfoList: {
        md5: string
        clickNum: number
      }[]
    }>
  ) {
    const value = await res
    const config = await Utils.getConfig()

    for (const [md5, clickNum] of Object.entries(config.clickNum ?? {})) {
      const target = value.emojiInfoList.find((emoji) => {
        return emoji.md5.toLowerCase() === md5.toLowerCase()
      })
      if (!target) continue
      target.clickNum = clickNum
    }

    value.emojiInfoList.sort((a, b) => {
      return b.clickNum - a.clickNum
    })

    return value
  }
}
