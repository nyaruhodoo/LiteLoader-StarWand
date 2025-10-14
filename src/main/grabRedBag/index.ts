import type { ConfigType } from 'src/defaultConfig'
import type { ChatType } from '@/types/wrapper/core/NodeIQQNTWrapperSession/Element'
import type { KernelMsgListener } from '@/types/wrapper/core/NodeIQQNTWrapperSession/NodeIKernelMsgService'
import { ipcMain, Notification } from 'electron'
import { Utils } from 'src/utils'
import { name, slug } from '@/manifest'
import { WrapperEventEnum } from '@/types/wrapper/eventEnum'
import { starWand } from '../hook/hookWrapper'

let authData:
  | {
    account: string
    mainAccount: string
    // qq 号
    uin: string
    uid: string
    nickName: ''
    gender: number
    age: number
    faceUrl: ''
    a2: ''
    d2: ''
    d2key: ''
  }
  | undefined

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

/**
 * 判断是否是不受支持的红包文本
 */
function isRedBagTextMsg(content: string) {
  return content?.startsWith('[QQ红包]') && !content.includes('专属') && content.includes('新版手机QQ')
}

/**
 * 检查红包是否为黑名单
 */
function checkBlacklist(config: ConfigType, msg: Parameters<KernelMsgListener['onRecvMsg']>[0][0]) {
  const { senderBlacklist, groupBlacklist, redPackTextBlacklist } = config

  return (
    senderBlacklist.includes(msg.senderUin)
    || groupBlacklist.includes(msg.peerUid)
    || redPackTextBlacklist.split('&').some(text => msg.elements[0]?.walletElement?.receiver.title.includes(text))
  )
}

/**
 * 发送纯文本消息
 */
function sendTextMsg({ chatType, peerUid, content }: { chatType: ChatType, peerUid: string, content: string }) {
  return starWand
    .Session
    ?.getMsgService()
    .sendMsg(
      '',
      {
        chatType,
        peerUid,
        guildId: '',
      },
      [
        {
          elementType: 1,
          elementId: '',
          textElement: {
            content,
            atType: 0,
            atUid: '',
            atTinyId: '',
            atNtUid: '',
            subElementType: 0,
            atChannelId: '',
            linkInfo: null,
            atRoleId: '',
            atRoleColor: 0,
            atRoleName: '',
            needNotify: 0,
          },
        },
      ],
      new Map(),
    )
}

/**
 * 处理红包消息
 */
async function onRecvActiveLuckyMoneyMsg(msg: Parameters<KernelMsgListener['onRecvMsg']>[0][0], config: ConfigType) {
  Utils.log('收到一条红包新消息')

  if (!authData?.uid)
    throw new Error('暂未获取到自身数据，不参与本次抢红包')
  if (checkBlacklist(config, msg))
    throw new Error('当前红包在黑名单内，请手动领取')

  const waitTime = Utils.randomInteger(config.randomDelay.min, config.randomDelay.max)
  await Utils.wait(waitTime)
  Utils.log(`本次延迟: ${waitTime}ms`)

  // 收集抢红包参数
  const { chatType, msgSeq, peerUid, peerUin, senderUin } = msg
  // 是否为自己发的红包
  const isOwn = senderUin === authData.uin

  const redBagType = msg.elements[0]?.walletElement?.msgType

  // 快速抢红包
  if (redBagType !== 6 || config.skipPwd) {
    const { result, errMsg, grabRedBagRsp } = await starWand.Session!.getMsgService().grabRedBag({
      recvUin: chatType === 1 ? authData.uin : peerUin,
      peerUid: chatType === 1 ? authData.uid : peerUid,
      recvType: chatType,
      // 似乎不是很重要
      name: 'Nyaruhodo',
      pcBody: msg.elements[0]!.walletElement!.pcBody,
      msgSeq,
      index: msg.elements[0]!.walletElement!.stringIndex,
      wishing: msg.elements[0]!.walletElement!.receiver.title,
    })

    if (result !== 0 || grabRedBagRsp.result !== 0)
      throw new Error(errMsg || '领取失败，红包可能已经抢空')

    console.timeEnd('抢红包总耗时')

    // 小红包，自己发的，私聊，未配置自动回复
    if (
      +grabRedBagRsp.recvdOrder.amount < config.minimumAmount
      || isOwn
      || chatType !== 2
      || config.autoSendmsg.length === 0
    ) {
      return
    }

    const autoSendMsg: string | undefined = config.autoSendmsg.split('&')[Utils.randomInteger(-1, config.autoSendmsg.length - 1)]
    if (!autoSendMsg)
      return

    setTimeout(
      () => {
        sendTextMsg({
          chatType,
          peerUid,
          content: autoSendMsg,
        })
      },
      Utils.randomInteger(3000, 5000),
    )
  }
  // 普通方式领口令红包，实际上并不保证resolve时领取成功
  else if (redBagType === 6) {
    const { result, errMsg } = await sendTextMsg({
      content: msg.elements[0]!.walletElement!.receiver.title,
      chatType,
      peerUid,
    })!

    if (result !== 0)
      throw new Error(errMsg)
    console.timeEnd('抢红包总耗时')
  }
  else {
    throw new Error(`当前红包类型${redBagType}并不被支持`)
  }
}

export async function grabRedBag(config?: ConfigType) {
  // @ts-expect-error  忽略错误
  authData = globalThis.authData
  starWand.wrapperEmitter.removeAllListeners(WrapperEventEnum.onRecvMsg)
  ipcMain.removeAllListeners(`${slug}:update`)

  const newConfig = config ?? (await Utils.getConfig())

  starWand.wrapperEmitter.addListener(WrapperEventEnum.onRecvMsg, async ({ params }) => {
    const msgList = params[0]

    try {
      // 目前QQ的实现中msgList仅会出现一个元素
      for (const msg of msgList) {
        const { peerName } = msg
        const targetName = peerName || '你的好友'

        for (const element of msg.elements) {
          if (element.textElement && isRedBagTextMsg(element.textElement.content))
            throw new Error(`${targetName}发送了红包，请使用手机领取`)

          if (element.walletElement) {
            await onRecvActiveLuckyMoneyMsg(msg, newConfig)
            showNotification(`已自动领取${targetName}发送的红包`)
          }
        }
      }
    }
    catch (error) {
      Utils.log(error)
      if (error instanceof Error) {
        showNotification(error.message)
      }
    }
  })

  ipcMain.on(`${slug}:update`, (_, updateConfig: ConfigType) => {
    grabRedBag(updateConfig)
  })
}
