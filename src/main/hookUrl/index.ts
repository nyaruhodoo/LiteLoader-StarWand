import { EventEnum } from '../enum/eventEnum'

export const msgWithUrlInterceptors = {
  async [`${EventEnum.checkMsgWithUrl}:response`](
    res: Promise<{
      checkUrlsResult: {
        url: string
        jumpUrl: string
        jumpResult: number
      }[]
    }>
  ) {
    const value = await res

    for (const i of value.checkUrlsResult) {
      i.jumpUrl = i.url
      i.jumpResult = 11
    }

    return res
  }
}
