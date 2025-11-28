import { WrapperEventEnum } from 'src/types/wrapper/eventEnum'
import { hookWrapper } from '@/main/hook/hookWrapper'
import { grabRedBag } from './grabRedBag'
import { favEmojiInterceptors } from './hookFavEmoji'
import { msgInterceptors } from './hookMsg'
import { msgWithUrlInterceptors } from './hookMsgWithUrl'
import { videoFileEventInterceptors } from './hookVideoFile';

(async () => {
  await hookWrapper({
    log: false,
    logDepth: null,
    eventBlacklist: [WrapperEventEnum.sendLog, /tianshu/i],
    eventInterceptors: {
      ...favEmojiInterceptors,
      ...msgWithUrlInterceptors,
      ...videoFileEventInterceptors,
      ...msgInterceptors,
    },
  })

  grabRedBag()
})()
