import type { WrapperInterceptors } from '@/types/wrapper/core'
import type { MsgInfo } from '@/types/wrapper/core/NodeIQQNTWrapperSession/Element'
import { inspect } from 'node:util'
import { RkeyImage } from './rkeyImage'

const msgCache = new Map<string, MsgInfo>()
const maxCacheSize = 5000

const rkeyImage = new RkeyImage()

function arkToText(msgInfo: MsgInfo) {
  for (const element of msgInfo.elements) {
    if (element.elementType !== 10 || !element.arkElement)
      continue
    const bytesData: {
      ver?: string
      prompt?: string
      config?: {
        type?: 'normal'
        width?: number
        height?: number
        forward?: number
        autoSize?: number
        ctime?: number
        token?: string
      }
      needShareCallBack?: boolean
      app?: string
      view?: string
      meta?: {
        detail_1?: {
          appid?: string
          appType?: number
          title?: string
          desc?: string
          icon?: string
          preview?: string
          url?: string
          scene?: number
          host?: {
            uin?: number
            nick?: string
          }
          shareTemplateId?: string
          shareTemplateData?: Record<string, never>
          qqdocurl?: string
          showLittleTail?: string
          gamePoints?: string
          gamePointsUrl?: string
          shareOrigin?: number
        }
      }
    } = JSON.parse(element.arkElement.bytesData)

    if (bytesData.meta?.detail_1?.qqdocurl) {
      element.textElement = {
        content: bytesData.meta?.detail_1?.qqdocurl,
        atType: 0,
        atUid: '0',
        atTinyId: '0',
        atNtUid: '',
        subElementType: 1,
        atChannelId: '0',
        linkInfo: {
          title: bytesData.meta.detail_1.title || '',
          icon: bytesData.meta.detail_1.icon || '',
          desc: bytesData.meta.detail_1.desc || '',
          richStatus: 2,
          tencentDocType: null,
        },
        atRoleId: '0',
        atRoleColor: 0,
        atRoleName: '',
        needNotify: 0,
      }
      element.elementType = 1

      element.arkElement = null

      msgInfo.msgType = 2
    }
  }
}

async function restoreRevokedMessage(msgList: MsgInfo[]) {
  for (const [index, msgInfo] of msgList.entries()) {
    if (msgInfo.elements[0]?.grayTipElement?.revokeElement) {
      const recallMsg = msgCache.get(msgInfo.msgId)
      if (recallMsg) {
        for (const element of recallMsg.elements) {
          if (element.picElement?.originImageUrl) {
            const newImageUrl = await rkeyImage.getNewImgUrl(element.picElement.originImageUrl)
            const newThumbPath = new Map<number, string>()
            element.picElement.thumbPath.forEach((_, key) => {
              newThumbPath.set(key, newImageUrl)
            })
            element.picElement.thumbPath = newThumbPath
          }
        }

        msgList[index] = recallMsg
      }
    }
  }
}

export const msgInterceptors: WrapperInterceptors = {
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/addKernelMsgListener/onRecvMsg': function ([msgInfoList]) {
    const msgInfo = msgInfoList[0]
    if (!msgInfo)
      return

    if (msgInfo.peerUid === '905509969') {
      console.log(inspect(msgInfoList, {
        depth: null,
        colors: true,
      }))
    }

    arkToText(msgInfo)

    if (msgCache.size >= maxCacheSize)
      msgCache.clear()

    msgCache.set(msgInfo.msgId, msgInfo)
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/addKernelMsgListener/onMsgInfoListUpdate': function ([msgInfoList]) {
    const msgInfo = msgInfoList[0]
    if (!msgInfo)
      return

    // 避免撤回消息被替换
    if (msgInfo.elements.length === 1 && msgInfo.elements[0]?.grayTipElement?.revokeElement && !msgInfo.elements[0]?.grayTipElement?.revokeElement.isSelfOperate) {
      msgInfoList.length = 0
      return
    }

    arkToText(msgInfo)
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getMsgsIncludeSelf:response': async function ({ applyRet }) {
    const res = await applyRet

    for (const msgInfo of res.msgList) {
      arkToText(msgInfo)
    }

    await restoreRevokedMessage(res.msgList)

    return res
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getAioFirstViewLatestMsgs:response': async function ({ applyRet }) {
    const res = await applyRet

    for (const msgInfo of res.msgList) {
      arkToText(msgInfo)
    }

    await restoreRevokedMessage(res.msgList)

    return res
  },
}
