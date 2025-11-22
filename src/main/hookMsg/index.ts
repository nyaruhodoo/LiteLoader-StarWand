import type { WrapperInterceptors } from '@/types/wrapper/core'
import type { MsgInfo } from '@/types/wrapper/core/NodeIQQNTWrapperSession/Element'
import { starWand } from '../hook/hookWrapper'

function ark2Text(msgInfo: MsgInfo) {
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

export const msgInterceptors: WrapperInterceptors = {
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/addKernelMsgListener/onRecvMsg': function ([msgInfoList]) {
    const msgInfo = msgInfoList[0]
    if (!msgInfo)
      return

    ark2Text(msgInfo)
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/addKernelMsgListener/onMsgInfoListUpdate': function ([msgInfoList]) {
    const msgInfo = msgInfoList[0]
    if (!msgInfo)
      return

    if (msgInfo.elements[0]?.grayTipElement?.revokeElement) {
      throw new Error('阻止替换撤回消息')
    }

    ark2Text(msgInfo)
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getMsgsIncludeSelf:response': async function ({ applyRet }) {
    const res = await applyRet

    for (const [index, msgInfo] of res.msgList.entries()) {
      ark2Text(msgInfo)

      if (msgInfo.elements[0]?.grayTipElement?.revokeElement) {
        const recallMsg = (await starWand.Session?.getMsgService().getRecallMsgsByMsgId({
          chatType: msgInfo.chatType,
          peerUid: msgInfo.peerUid,
          guildId: msgInfo.guildId,
        }, [msgInfo.msgId]))?.msgList[0]
        if (recallMsg) {
          recallMsg.msgType = 2
          res.msgList[index] = recallMsg
        }
      }
    }

    return res
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getAioFirstViewLatestMsgs:response': async function ({ applyRet }) {
    const res = await applyRet

    for (const [index, msgInfo] of res.msgList.entries()) {
      ark2Text(msgInfo)

      if (msgInfo.elements[0]?.grayTipElement?.revokeElement) {
        const recallMsg = (await starWand.Session?.getMsgService().getRecallMsgsByMsgId({
          chatType: msgInfo.chatType,
          peerUid: msgInfo.peerUid,
          guildId: msgInfo.guildId,
        }, [msgInfo.msgId]))?.msgList[0]
        if (recallMsg) {
          recallMsg.msgType = 2
          res.msgList[index] = recallMsg
        }
      }
    }

    return res
  },
}
