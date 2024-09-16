import type { NodeIKernelMsgService, SendFileElement, SendVideoElement } from 'napcat.core'
import { ElementType } from 'napcat.core'
import { EventEnum } from '../enum/eventEnum'
import { extname, dirname, join } from 'node:path'
import { inspect } from 'node:util'
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, readFileSync } from 'fs'
import { NTcore, wrapperEmitter } from '../hook/hookWrapper'

wrapperEmitter.addListener('NodeIQQNTWrapperSession/create/getMsgService/downloadRichMedia', (data) => {
  console.log('downloadRichMedia')
  console.log(inspect(data, { depth: null, colors: true }))
})

wrapperEmitter.addListener(
  'NodeIQQNTWrapperSession/create/getMsgService/addKernelMsgListener/onRichMediaDownloadComplete',
  (data) => {
    console.log('onRichMediaDownloadComplete')
    console.log(inspect(data, { depth: null, colors: true }))
  }
)

wrapperEmitter.addListener('NodeIQQNTWrapperSession/create/getMsgService/addKernelMsgListener/onRecvMsg', (data) => {
  console.log('onRecvMsg')
  console.log(inspect(data, { depth: null, colors: true }))
})

/**
 * 同步获取文件MD5
 */
const getFileMD5 = (filePath: string) => {
  const hash = createHash('md5')
  const fileBuffer = readFileSync(filePath)
  hash.update(fileBuffer)
  return hash.digest('hex')
}

/**
 * 同步复制文件到指定目录
 */
const copyFile = (srcFile: string, destFile: string) => {
  const dir = dirname(destFile)
  if (!existsSync(dir)) throw new Error('路径不存在')
  copyFileSync(srcFile, destFile)
  return destFile
}

/**
 * 获取QQ视频上传时的路径
 */
const getVideoPath = (filePath: string, fileName: string) => {
  const path = NTcore?.session.getMsgService().getRichMediaFilePathForGuild({
    md5HexStr: getFileMD5(filePath),
    fileName: fileName,
    elementType: ElementType.VIDEO,
    elementSubType: 0,
    thumbSize: 0,
    needCreate: true,
    downloadType: 1,
    file_uuid: ''
  })

  if (!path) throw new Error('路径生成失败，请检查参数是否有误')

  return path
}

/**
 * 根据视频存储路径获取新的封面存储路径
 */
const videoPath2ThumbPath = (videoPath: string) => {
  return join(dirname(videoPath.replace('Ori', 'Thumb')))
}

const isVideoFile = (filePath: string) => {
  const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpeg', '.mpg', '.3gp']
  const extName = extname(filePath).toLowerCase()
  return videoExtensions.includes(extName)
}

const file2Video = (sendMsg: Parameters<NodeIKernelMsgService['sendMsg']>) => {
  console.log('原视频数据')
  console.log(inspect(sendMsg, { depth: null, colors: true }))

  const { fileName, filePath, picHeight, picWidth, picThumbPath, fileSize } = (sendMsg[2][0] as SendFileElement)
    .fileElement

  const newVideoPath = getVideoPath(filePath, fileName)
  copyFile(filePath, newVideoPath)

  const oldThumbPath = picThumbPath?.get(750)
  if (!oldThumbPath) throw new Error('原视频封面丢失')
  const newThumbPath = videoPath2ThumbPath(newVideoPath)
  // copyFile(oldThumbPath, newThumbPath)

  const thumbPath = new Map()
  thumbPath.set(
    0,
    'C:\\Users\\Administrator\\Documents\\Tencent Files\\3751329135\\nt_qq\\nt_data\\Video\\2024-09\\Thumb\\b99f4ee4550670d05e3492002a7c0428_0.png'
  )

  /**
   * 一个视频可以成功发送的前提是，该文件处于 C:\Users\Administrator\Documents\Tencent Files\你的uid\nt_qq\nt_data\Video\xxxx-xx\Ori
   * 封面和上面一样只不过是 Thumb 目录
   */
  const videoElement: SendVideoElement = {
    elementType: ElementType.VIDEO,
    elementId: '',
    videoElement: {
      filePath: newVideoPath,
      fileName,
      videoMd5: getFileMD5(newVideoPath),
      thumbMd5: 'f3ec62461020f1001d969ae60c63d6c8',
      fileTime: 10,
      thumbSize: 7492,

      fileSize,
      thumbWidth: picWidth,
      thumbHeight: picHeight,

      thumbPath
    }
  }
  sendMsg[2][0] = videoElement

  console.log('魔改的的视频数据')
  console.log(inspect(sendMsg, { depth: null, colors: true }))

  return sendMsg
}

export const videoFileEventInterceptors = {
  [EventEnum.sendMsg](sendMsg: Parameters<NodeIKernelMsgService['sendMsg']>) {
    if (sendMsg[2][0].elementType !== ElementType.FILE) return sendMsg
    const { filePath } = (sendMsg[2][0] as SendFileElement).fileElement
    if (!isVideoFile(filePath)) return sendMsg

    return file2Video(sendMsg)
  }
}
