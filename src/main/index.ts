import { hookWrapper } from '@/main/hook/hookWrapper'
import { EventEnum } from './enum/eventEnum'
import { vipEventInterceptors } from './hookVIP'
import { themeEventInterceptors } from './hookTheme'
import { videoFileEventInterceptors } from './hookVideoFile'
;(async () => {
  await hookWrapper({
    log: false,
    eventBlacklist: [EventEnum.sendLog, /tianshu/i],
    eventInterceptors: {
      ...vipEventInterceptors,
      ...themeEventInterceptors,
      ...videoFileEventInterceptors
    }
  })
})()
