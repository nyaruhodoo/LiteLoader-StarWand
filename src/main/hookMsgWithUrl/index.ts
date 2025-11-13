import type { WrapperInterceptors } from '@/types/wrapper/core'

export const msgWithUrlInterceptors: WrapperInterceptors = {
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/checkMsgWithUrl:response': async function (
    { applyRet },
  ) {
    const res = await applyRet
    for (const i of res.checkUrlsResult) {
      i.jumpUrl = i.url
      i.jumpResult = 11
    }
    return res
  },
}
