import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { access, copyFile, mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname, extname } from 'node:path'

import { blackImgBase64 } from './blackImg'

/** audioToPcm 的输出固定为 24kHz / 单声道 / 16bit，即每秒 48000 字节 */
const PCM_BYTES_PER_SECOND = 24000 * 2

export class Utils {
  /**
   * 判断给定文件路径是否是视频
   */
  static isVideoFile(filePath: string) {
    const videoExtensions = [
      '.mp4',
      '.avi',
      '.mkv',
      '.mov',
      '.wmv',
      '.flv',
      '.webm',
      '.m4v',
      '.mpeg',
      '.mpg',
      '.3gp',
    ]
    const extName = extname(filePath).toLowerCase()
    return videoExtensions.includes(extName)
  }

  static isImgFile(filePath: string) {
    const imgExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.avif', '.svg']
    const extName = extname(filePath).toLowerCase()
    return imgExtensions.includes(extName)
  }

  static isAudioFile(filePath: string) {
    // 常见的音频文件扩展名列表
    const audioExtensions = [
      '.mp3',
      '.wav',
      '.flac',
      '.aac',
      '.ogg',
      '.wma',
      '.m4a',
      '.ape',
      '.ac3',
      '.mid',
      '.midi',
      '.opus',
      '.ra',
      '.rm',
      '.aiff',
      '.au',
      '.mka',
    ]
    // 获取文件扩展名并转为小写（确保匹配不区分大小写）
    const extName = extname(filePath).toLowerCase()
    // 判断扩展名是否在音频扩展名列表中
    return audioExtensions.includes(extName)
  }

  /**
   * 获取文件MD5
   */
  static getFileMD5(filePath: string) {
    const hash = createHash('md5')
    const fileBuffer = readFileSync(filePath)
    hash.update(fileBuffer)
    return hash.digest('hex')
  }

  /**
   * 监听文件是否已创建
   */
  static checkFileExists(filePath: string) {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('文件路径不能为空且必须为字符串')
    }

    const { promise, resolve, reject } = Promise.withResolvers()
    let attempts = 0

    const check = async () => {
      attempts++
      try {
        await access(filePath)
        resolve(filePath)
      } catch {
        if (attempts >= 5) {
          try {
            const pureBase64 = blackImgBase64.replace(/^data:image\/\w+;base64,/, '')

            const imgBuffer = Buffer.from(pureBase64, 'base64')
            await writeFile(filePath, imgBuffer)
            resolve(filePath)
          } catch {
            reject(new Error('创建封面图失败'))
          }

          return
        }
        setTimeout(check, 200)
      }
    }
    void check()

    return promise
  }

  /**
   * 判断目标文件是否已存在且非空
   *
   * QQ 的富媒体存储路径由文件 md5 推导，同名文件内容必然一致，
   * 所以「已存在」等价于「之前已经写入成功」，无需重复复制或转码。
   */
  static async targetFileExists(filePath: string) {
    try {
      const fileStat = await stat(filePath)
      return fileStat.isFile() && fileStat.size > 0
    } catch {
      // 文件不存在（ENOENT）或无权访问，都当作需要重新写入
      return false
    }
  }

  /**
   * 检查目录是否存在后复制文件
   * 目标文件已存在时直接跳过，避免重复复制
   */
  static async copyFileWithDirCheck(oldPath: string, newPath: string) {
    if (await Utils.targetFileExists(newPath)) return

    // mkdir 带 recursive 时目录已存在不会报错，无需再单独判断
    await mkdir(dirname(newPath), { recursive: true })
    await copyFile(oldPath, newPath)
  }

  /**
   * 把 buffer 写入文件，目标文件已存在时直接跳过
   */
  static async bufferToFile(buffer: Buffer, filePath: string): Promise<void> {
    if (await Utils.targetFileExists(filePath)) return

    try {
      // recursive: true 确保即使多级目录不存在（如 a/b/c）也能一并创建
      await mkdir(dirname(filePath), { recursive: true })
      await writeFile(filePath, buffer)
    } catch (error) {
      console.error('保存文件时出错:', error)
      throw error
    }
  }

  /**
   * 计算 audioToPcm 产出的裸 PCM 时长
   * @returns 返回值单位是秒 (seconds)
   */
  static getPcmDuration(pcmBuffer: Buffer) {
    return Math.round(pcmBuffer.length / PCM_BYTES_PER_SECOND)
  }
}
