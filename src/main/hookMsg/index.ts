import type { WrapperInterceptors } from '@/types/wrapper/core'
import type { MsgInfo } from '@/types/wrapper/core/NodeIQQNTWrapperSession/Element'
import { writeFile } from 'node:fs/promises'
import { RkeyImage } from './rkeyImage'

export async function simpleDownload(imageUrl: string, targetPath: string) {
  try {
    // 1. 发起fetch请求，校验响应是否成功
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`图片请求失败，状态码：${response.status} ${response.statusText}`)
    }

    // 2. 校验响应体是否存在
    if (!response.body) {
      throw new Error('图片响应体为空，无法下载')
    }

    // 3. 读取响应为ArrayBuffer并转换为Buffer
    const arrayBuffer = await response.arrayBuffer()
    // eslint-disable-next-line node/prefer-global/buffer
    const buffer = Buffer.from(arrayBuffer)

    // 4. 写入指定路径（目录已存在，直接写文件）
    await writeFile(targetPath, buffer)

    console.log('下载完成：', targetPath)
  }
  catch (error) {
    // 统一捕获错误并提示
    const errMsg = error instanceof Error ? error.message : '未知错误'
    console.error(`下载失败【${targetPath}】：`, errMsg)
    throw error // 可选：抛出错误让上层处理
  }
}

const msgCache = new Map<string, MsgInfo>()
const maxCacheSize = 5000
const rkeyImage = new RkeyImage()

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
            // const path = element.picElement.thumbPath.get(0)
            // path && await simpleDownload(newImageUrl, path)
          }
        }

        // @ts-expect-error  忽略错误
        recallMsg._recallMsg = true
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

    arkToText(msgInfoList)

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

    arkToText(msgInfoList)
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getMsgsIncludeSelf:response': async function ({ applyRet }) {
    const res = await applyRet

    arkToText(res.msgList)

    await restoreRevokedMessage(res.msgList)

    return res
  },
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getAioFirstViewLatestMsgs:response': async function ({ applyRet }) {
    const res = await applyRet

    arkToText(res.msgList)
    await restoreRevokedMessage(res.msgList)

    return res
  },

}
