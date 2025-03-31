import { hookWrapper } from '@/main/hook/hookWrapper'
import { EventEnum } from './enum/eventEnum'
import { vipEventInterceptors } from './hookVIP'
import { themeEventInterceptors } from './hookTheme'
import { videoFileEventInterceptors } from './hookVideoFile'
import { msgWithUrlInterceptors } from './hookUrl'
import { favEmojiListener, favEmojiInterceptors } from './hookFavEmoji'
;(async () => {
  await hookWrapper({
    log: false,
    eventBlacklist: [EventEnum.sendLog, EventEnum.onQQScreenWindowsInfo, /tianshu/i],
    eventInterceptors: {
      ...vipEventInterceptors,
      ...themeEventInterceptors,
      ...videoFileEventInterceptors,
      ...msgWithUrlInterceptors,
      ...favEmojiInterceptors
    }
  })
  // 本来是打算用Interceptors实现的，奈何已经有同事件的占位了...
  favEmojiListener()
})()
