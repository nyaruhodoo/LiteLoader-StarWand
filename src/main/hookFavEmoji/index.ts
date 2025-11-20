import type { WrapperInterceptors } from '@/types/wrapper/core'
import { Utils } from 'src/utils'
import { ElementType } from '@/types/wrapper/core/NodeIQQNTWrapperSession/Element'
import { WrapperEventEnum } from '@/types/wrapper/eventEnum'
import { starWand } from '../hook/hookWrapper'

starWand.wrapperEmitter.addListener(
  WrapperEventEnum.sendMsg,
  async ({ params }) => {
    const config = await Utils.getConfig('main')
    if (!config.clickNum)
      config.clickNum = {}

    for (const msg of params[2]) {
      if (msg.elementType !== ElementType.PicElement || msg.picElement?.picSubType !== 1)
        continue
      const md5 = msg.picElement.md5HexStr
      config.clickNum[md5] = (config.clickNum[md5] || 0) + 1
    }

    Utils.updateConfig(config, 'main')
  },
)

export const favEmojiInterceptors: WrapperInterceptors = {
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/fetchFavEmojiList:response': async function (
    { applyRet },
  ) {
    const res = await applyRet
    const config = await Utils.getConfig('main')

    for (const [md5, clickNum] of Object.entries(config.clickNum ?? {})) {
      const target = res.emojiInfoList.find((emoji) => {
        return emoji.md5.toLowerCase() === md5.toLowerCase()
      })
      if (!target)
        continue
      target.clickNum = clickNum
    }

    res.emojiInfoList.sort((a, b) => {
      return b.clickNum - a.clickNum
    })

    return res
  },
}
