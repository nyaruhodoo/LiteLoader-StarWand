import { WrapperEventEnum } from 'src/types/wrapper/eventEnum'
import { hookWrapper } from '@/main/hook/hookWrapper'
import { grabRedBag } from './grabRedBag'
import { msgInterceptors } from './hookMsg'
import { msgWithUrlInterceptors } from './hookMsgWithUrl'
import { videoFileEventInterceptors } from './hookVideoFile';

(async () => {
  await hookWrapper({
    log: false,
    logDepth: null,
    eventBlacklist: [WrapperEventEnum.sendLog, /tianshu/i],
    eventInterceptors: {
      ...msgWithUrlInterceptors,
      ...videoFileEventInterceptors,
      ...msgInterceptors,
    },
  })

  grabRedBag()
})()
