import type { WrapperInterceptors } from '@/types/wrapper/core'
import type { MsgInfo } from '@/types/wrapper/core/NodeIQQNTWrapperSession/Element'
import { Notification } from 'electron'
import { Utils } from 'src/utils'
import { name } from '@/manifest'

import { ElementType } from '@/types/wrapper/core/NodeIQQNTWrapperSession/Element'

/**
 * 发送系统通知
 */
function showNotification(body: string) {
  if (!Notification.isSupported())
    return
  const not = new Notification({
    title: name,
    body,
  })
  not.show()
}

function arkToText(msgList: MsgInfo[]) {
  for (const msgInfo of msgList) {
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
}

function msgFilter(msgList: MsgInfo[]) {
  const { messageBlock: {
    keywordBlacklist,
    blockVideo,
    blockImage,
    blockEmoji,
    blockSolitaire,
    blockRobot,
    blockAtAll,
    whitelist,
    blockPoke,
    blockEmojiReply,
  } } = Utils.getConfig('main')

  return msgList.filter((msgInfo) => {
    if (msgInfo.chatType !== 2)
      return true

    if (whitelist.includes(msgInfo.peerUid))
      return true

    const botAttr = msgInfo.msgAttrs.get(22) as Record<string, unknown>

    if (blockRobot && botAttr && botAttr.botMetaData)
      return false

    if (msgInfo.elements.length === 1) {
      const element = msgInfo.elements[0]
      if (blockVideo && element?.elementType === ElementType.VideoElement)
        return false
      if (blockImage && element?.elementType === ElementType.PicElement)
        return false
      if (blockEmoji && element?.elementType === ElementType.FaceElement)
        return false
      if (blockSolitaire && element?.elementType === ElementType.FaceElement && element.faceElement?.chainCount !== null)
        return false
      if ((blockPoke || blockEmojiReply) && element?.elementType === ElementType.GrayTipElement) {
        if (blockPoke && element.grayTipElement?.subElementType === 17) {
          return false
        }
        if (blockEmojiReply && element.grayTipElement?.subElementType === 12) {
          return false
        }
      }
    }

    // 通用屏蔽
    for (const element of msgInfo.elements) {
      if (blockAtAll && element.textElement && element.textElement.atType === 1) {
        return false
      }

      if (keywordBlacklist && element.textElement) {
        const isBlocked = keywordBlacklist.split('&').some(text => element.textElement?.content.includes(text))
        if (isBlocked) {
          return false
        }
      }
    }

    return true
  })
}

function msgListener(msgInfoList: MsgInfo[]) {
  const { messageMonitor: { keyword, favoriteList, whitelist } } = Utils.getConfig('main')

  for (const msgInfo of msgInfoList) {
    if (msgInfo.chatType !== 2)
      return

    if (favoriteList && msgInfo.senderUin && favoriteList.includes(msgInfo.senderUin)) {
      showNotification(`你暗恋的人${msgInfo.sendNickName}在${msgInfo.peerName}发送了消息`)
      return
    }

    if (!whitelist.includes(msgInfo.peerUid) && whitelist !== '*') {
      return
    }

    for (const element of msgInfo.elements) {
      if (element.textElement && keyword && element.textElement.content.includes(keyword)) {
        showNotification(`${msgInfo.peerName}检测到关键词: ${keyword}`)
      }
    }
  }
}

export const msgInterceptors: WrapperInterceptors = {
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/addKernelMsgListener/onRecvMsg': function ([msgInfoList]) {
    const msgInfo = msgInfoList[0]
    if (!msgInfo)
      return

    arkToText(msgInfoList)
    const newMsg = msgFilter(msgInfoList)
    // 懒得单独抽了，直接凑活写
    msgListener(newMsg)
    return [newMsg]
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/addKernelMsgListener/onMsgInfoListUpdate': function ([msgInfoList]) {
    const msgInfo = msgInfoList[0]
    if (!msgInfo)
      return

    const newMsg = msgFilter(msgInfoList)
    return [newMsg]
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getMsgsIncludeSelf:response': async function ({ applyRet }) {
    const res = await applyRet

    arkToText(res.msgList)
    const newMsg = msgFilter(res.msgList)
    res.msgList = newMsg

    return res
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getAioFirstViewLatestMsgs:response': async function ({ applyRet }) {
    const res = await applyRet

    arkToText(res.msgList)
    const newMsg = msgFilter(res.msgList)
    res.msgList = newMsg

    return res
  },

}
