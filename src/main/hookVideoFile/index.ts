import type { WrapperInterceptors } from '@/types/wrapper/core'
import type { FileElement } from '@/types/wrapper/core/NodeIQQNTWrapperSession/Element'
import type { NodeIKernelMsgService } from '@/types/wrapper/core/NodeIQQNTWrapperSession/NodeIKernelMsgService'
import { access, constants, readFile } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { audioToPcm, silkEncode } from '@acidify/codec'
import { ElementType } from '@/types/wrapper/core/NodeIQQNTWrapperSession/Element'
import { starWand } from '../hook/hookWrapper'
import { Utils } from './utils'

/**
 * 获取QQ视频上传时的路径
 */
function getUploadPath(filePath: string, fileName: string, elementType: ElementType) {
  const md5HexStr = Utils.getFileMD5(filePath)
  const uploadPath = starWand?.Session?.getMsgService().getRichMediaFilePathForGuild({
    md5HexStr,
    fileName,
    elementType,
    elementSubType: 0,
    thumbSize: 0,
    needCreate: true,
    downloadType: 1,
    file_uuid: '',
  })
  if (!uploadPath)
    throw new Error('无法获取视频上传路径')
  return {
    uploadPath,
    md5HexStr,
  }
}

/**
 * 根据视频存储路径获取新的封面存储路径
 */
function videoPath2ThumbPath(videoPath: string) {
  const test = videoPath.replace('Ori', 'Thumb')
  const dir = dirname(test)
  const ext1 = extname(test)
  const baseName = basename(test, ext1)

  // 好像只能是png后缀?
  const newFileName = `${baseName}_0.png`

  const newFilePath = join(dir, newFileName)

  return newFilePath
}

async function file2Video(sendMsg: Parameters<NodeIKernelMsgService['sendMsg']>) {
  const { fileName, filePath, picHeight, picWidth, picThumbPath, fileSize } = sendMsg[2][0]?.fileElement as FileElement

  /**
   * 一个视频可以成功发送的前提是，该文件处于 C:\Users\Administrator\Documents\Tencent Files\uid\nt_qq\nt_data\Video\xxxx-xx\Ori
   * 封面和上面一样只不过是 Thumb 目录
   * 或许直接改 downloadRichMedia 的参数指向原路径会更简单？
   */
  const { md5HexStr, uploadPath } = getUploadPath(filePath, fileName, ElementType.VideoElement)

  // 视频封面可以沿用 QQ 的逻辑，只不过是异步创建的
  const oldThumbPath = picThumbPath?.get(750)
  if (!oldThumbPath)
    throw new Error('视频封面丢失')

  await Promise.all([Utils.copyFileWithDirCheck(filePath, uploadPath), Utils.checkFileExists(oldThumbPath)])

  const newThumbPath = videoPath2ThumbPath(uploadPath)
  await Utils.copyFileWithDirCheck(oldThumbPath, newThumbPath)

  const thumbPath = new Map()
  thumbPath.set(0, newThumbPath)

  const videoElement = {
    elementType: ElementType.VideoElement,
    elementId: '',
    videoElement: {
      filePath: uploadPath,
      fileName,
      videoMd5: md5HexStr,
      thumbMd5: Utils.getFileMD5(oldThumbPath),
      fileSize,
      thumbWidth: picWidth,
      thumbHeight: picHeight,
      thumbPath,
    },
  }
  sendMsg[2][0] = videoElement

  return starWand?.Session?.getMsgService().sendMsg(...sendMsg)
}

async function file2Img(sendMsg: Parameters<NodeIKernelMsgService['sendMsg']>) {
  const { fileName, filePath, picHeight, picWidth, fileSize } = sendMsg[2][0]?.fileElement as FileElement

  /**
   * 一个图片可以成功发送的前提是，该文件处于 C:\Users\Administrator\Documents\Tencent Files\uid\nt_qq\nt_data\Pic\xxxx-xx\Ori
   */
  const { md5HexStr, uploadPath } = getUploadPath(filePath, fileName, ElementType.PicElement)

  await Utils.copyFileWithDirCheck(filePath, uploadPath)

  const imgElement = {
    elementType: ElementType.PicElement,
    elementId: '',
    picElement: {
      md5HexStr,
      fileSize,
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
      summary: '',
    },
  } as const

  // @ts-expect-error  忽略错误
  sendMsg[2][0] = imgElement

  return starWand?.Session?.getMsgService().sendMsg(...sendMsg)
}

async function file2Audio(sendMsg: Parameters<NodeIKernelMsgService['sendMsg']>) {
  try {
    const { filePath, fileSize } = sendMsg[2][0]?.fileElement as FileElement
    const md5HexStr = Utils.getFileMD5(filePath)

    const uploadPath = starWand?.Session?.getMsgService().getRichMediaFilePathForGuild({
      md5HexStr,
      fileName: '.amr',
      elementType: 4,
      elementSubType: 0,
      thumbSize: 0,
      needCreate: true,
      downloadType: 1,
      file_uuid: '',
    })

    if (!uploadPath)
      throw new Error('无法获取音频上传路径')

    const buffer = await readFile(filePath)

    // --- 新增逻辑：检查文件是否存在 ---
    let fileExists = false
    try {
      await access(uploadPath, constants.F_OK)
      fileExists = true
    }
    catch {
      fileExists = false
    }

    if (!fileExists) {
      const pcmBuffer = await audioToPcm(buffer)
      const silkBuffer = await silkEncode(pcmBuffer)

      await Utils.bufferToFile(silkBuffer, uploadPath)
    }

    const pttElement = {
      elementType: ElementType.PttElement,
      elementId: '',
      pttElement: {
        fileName: `${md5HexStr}.amr`,
        filePath: uploadPath,
        md5HexStr,
        fileSize,
        duration: await Utils.getAudioDuration(buffer),
        formatType: 1,
        voiceType: 1,
        voiceChangeType: 0,
        canConvert2Text: true,
        // 不知道怎么算，随意了
        waveAmplitudes: [29, 29, 114, 144, 144, 144],
        fileSubId: '',
        playState: 1,
        autoConvertText: 0,
        storeID: 0,
        otherBusinessInfo: {
          aiVoiceType: 0,
        },
      },
    } as const

    // @ts-expect-error  忽略错误
    sendMsg[2][0] = pttElement

    return starWand?.Session?.getMsgService().sendMsg(...sendMsg)
  }
  catch (error) {
    console.log(error)
  }
}

export const videoFileEventInterceptors: WrapperInterceptors = {
  'NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/sendMsg': function (params) {
    if (params[1].chatType === 8)
      return params
    if (params[2][0]?.elementType !== ElementType.FileElement)
      return params

    const { filePath, fileSize } = params[2][0].fileElement!

    // 不能发超过100mb的内容
    if (+fileSize / 1024 / 1024 >= 99)
      return params

    if (Utils.isVideoFile(filePath)) {
      file2Video(params)
      throw new Error('已转换为小视频消息')
    }

    if (Utils.isImgFile(filePath)) {
      file2Img(params)
      throw new Error('已转换为图片消息')
    }

    if (Utils.isAudioFile(filePath)) {
      file2Audio(params)
      throw new Error('已经转换为语音消息')
    }

    return params
  },
}
