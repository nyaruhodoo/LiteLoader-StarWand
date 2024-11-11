import type { NodeIKernelMsgService, SendFileElement, SendPicElement, SendVideoElement } from 'napcat.core'
import { ElementType } from 'napcat.core'
import { EventEnum } from '../enum/eventEnum'
import { basename, dirname, extname, join } from 'node:path'
import { NTcore } from '../hook/hookWrapper'
import { Utils } from './utils'
import { copyFile } from 'node:fs/promises'

/**
 * 获取QQ视频上传时的路径
 */
const getUploadPath = (filePath: string, fileName: string, elementType: ElementType) => {
  const md5HexStr = Utils.getFileMD5(filePath)
  const uploadPath = NTcore?.session.getMsgService().getRichMediaFilePathForGuild({
    md5HexStr,
    fileName: fileName,
    elementType,
    elementSubType: 0,
    thumbSize: 0,
    needCreate: true,
    downloadType: 1,
    file_uuid: ''
  })
  if (!uploadPath) throw new Error('无法获取视频上传路径')
  return {
    uploadPath,
    md5HexStr
  }
}

/**
 * 根据视频存储路径获取新的封面存储路径
 */
const videoPath2ThumbPath = (videoPath: string) => {
  const test = videoPath.replace('Ori', 'Thumb')
  const dir = dirname(test)
  const ext1 = extname(test)
  const baseName = basename(test, ext1)

  // 好像只能是png后缀，麻了
  const newFileName = `${baseName}_0.png`

  const newFilePath = join(dir, newFileName)

  return newFilePath
}

const file2Video = async (sendMsg: Parameters<NodeIKernelMsgService['sendMsg']>) => {
  const { fileName, filePath, picHeight, picWidth, picThumbPath, fileSize } = (sendMsg[2][0] as SendFileElement)
    .fileElement

  /**
   * 一个视频可以成功发送的前提是，该文件处于 C:\Users\Administrator\Documents\Tencent Files\uid\nt_qq\nt_data\Video\xxxx-xx\Ori
   * 封面和上面一样只不过是 Thumb 目录
   * 或许直接改 downloadRichMedia 的参数指向原路径会更简单？
   */
  const { md5HexStr, uploadPath } = getUploadPath(filePath, fileName, ElementType.VIDEO)

  // 视频封面可以沿用 QQ 的逻辑，只不过是异步创建的
  const oldThumbPath = picThumbPath?.get(750)
  if (!oldThumbPath) throw new Error('视频封面丢失')

  await Promise.all([copyFile(filePath, uploadPath), Utils.checkFileExists(oldThumbPath)])

  const newThumbPath = videoPath2ThumbPath(uploadPath)
  await copyFile(oldThumbPath, newThumbPath)

  const thumbPath = new Map()
  thumbPath.set(0, newThumbPath)

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

  return NTcore?.session.getMsgService().sendMsg(...sendMsg)
}

const file2Img = async (sendMsg: Parameters<NodeIKernelMsgService['sendMsg']>) => {
  const { fileName, filePath, picHeight, picWidth, fileSize } = (sendMsg[2][0] as SendFileElement).fileElement

  /**
   * 一个图片可以成功发送的前提是，该文件处于 C:\Users\Administrator\Documents\Tencent Files\uid\nt_qq\nt_data\Pic\xxxx-xx\Ori
   */
  const { md5HexStr, uploadPath } = getUploadPath(filePath, fileName, ElementType.PIC)

  await copyFile(filePath, uploadPath)

  const imgElement: SendPicElement = {
    elementType: ElementType.PIC,
    elementId: '',
    picElement: {
      md5HexStr,
      fileSize: fileSize,
      picWidth: picWidth ?? 0,
      picHeight: picHeight ?? 0,
      fileName: `${md5HexStr}.${extname(filePath).toLowerCase()}`,
      sourcePath: '',
      original: true,
      picType: 1000,
      picSubType: 0,
      fileUuid: '',
      fileSubId: '',
      thumbFileSize: 0,
      summary: ''
    }
  }
  sendMsg[2][0] = imgElement

  return NTcore?.session.getMsgService().sendMsg(...sendMsg)
}

export const videoFileEventInterceptors = {
  [EventEnum.sendMsg](sendMsg: Parameters<NodeIKernelMsgService['sendMsg']>) {
    if (sendMsg[2][0].elementType !== ElementType.FILE) return sendMsg
    const { filePath } = (sendMsg[2][0] as SendFileElement).fileElement

    if (Utils.isVideoFile(filePath)) {
      file2Video(sendMsg)
      throw new Error('喵喵喵')
    }

    if (Utils.isImgFile(filePath)) {
      file2Img(sendMsg)
      throw new Error('喵喵喵')
    }

    return sendMsg
  }
}
