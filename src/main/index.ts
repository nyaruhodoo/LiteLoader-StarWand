import { hookWrapper } from '@/main/hook/hookWrapper'
import { EventEnum } from './enum/eventEnum'
import { vipEventInterceptors } from './hookVIP/hookVIP'
import { themeEventInterceptors } from './hookTheme/hookTheme'
;(async () => {
  await hookWrapper({
    log: false,
    eventBlacklist: [EventEnum.sendLog, /tianshu/i],
    eventInterceptors: {
      ...vipEventInterceptors,
      ...themeEventInterceptors
    }
  })
})()
