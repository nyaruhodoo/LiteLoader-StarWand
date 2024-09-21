import type { NodeIKernelMsgService, SendFileElement, SendVideoElement } from 'napcat.core'
import { ElementType } from 'napcat.core'
import { inspect } from 'node:util'
import { NTcore } from '../hook/hookWrapper'
import { Utils } from './utils'
import { copyFile } from 'node:fs/promises'
import { getUploadPath } from '.'

export const file2Video = async (sendMsg: Parameters<NodeIKernelMsgService['sendMsg']>) => {
  console.log('原视频数据')
  console.log(inspect(sendMsg, { depth: null, colors: true }))

  const { fileName, filePath, picHeight, picWidth, picThumbPath, fileSize } = (sendMsg[2][0] as SendFileElement)
    .fileElement

  /**
   * 一个视频可以成功发送的前提是，该文件处于 C:\Users\Administrator\Documents\Tencent Files\uid\nt_qq\nt_data\Video\xxxx-xx\Ori
   * 封面和上面一样只不过是 Thumb 目录
   */
  const { md5HexStr, uploadPath } = getUploadPath(filePath, fileName)

  // 视频封面可以沿用 QQ 的逻辑，只不过是异步创建的
  const oldThumbPath = picThumbPath?.get(750)
  if (!oldThumbPath) throw new Error('视频封面丢失')

  await Promise.all([copyFile(filePath, uploadPath), Utils.checkFileExists(oldThumbPath)])

  // const newThumbPath = videoPath2ThumbPath(newVideoPath)
  // copyFile(oldThumbPath, newThumbPath)
  // const thumbPath = new Map()
  // thumbPath.set(
  //   0,
  //   'C:\\Users\\Administrator\\Documents\\Tencent Files\\3751329135\\nt_qq\\nt_data\\Video\\2024-09\\Thumb\\b99f4ee4550670d05e3492002a7c0428_0.png'
  // )
  const videoElement: SendVideoElement = {
    elementType: ElementType.VIDEO,
    elementId: '',
    videoElement: {
      filePath: uploadPath,
      fileName,
      videoMd5: md5HexStr,
      thumbMd5: Utils.getFileMD5(oldThumbPath),
      fileSize,
      thumbWidth: picWidth,
      thumbHeight: picHeight,
      thumbPath
    }
  }
  sendMsg[2][0] = videoElement

  console.log('魔改的的视频数据')
  console.log(inspect(sendMsg, { depth: null, colors: true }))

  NTcore?.session.getMsgService().sendMsg(...sendMsg)
}
