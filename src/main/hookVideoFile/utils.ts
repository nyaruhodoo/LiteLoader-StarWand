import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { access, constants, copyFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, extname } from 'node:path'
import { parseBuffer } from 'music-metadata'
import { blackImgBase64 } from './blackImg'

export class Utils {
  /**
   * 判断给定文件路径是否是视频
   */
  static isVideoFile(filePath: string) {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpeg', '.mpg', '.3gp']
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
      }
      catch {
        if (attempts >= 5) {
          try {
            const pureBase64 = blackImgBase64.replace(/^data:image\/\w+;base64,/, '')

            // eslint-disable-next-line node/prefer-global/buffer
            const imgBuffer = Buffer.from(pureBase64, 'base64')
            await writeFile(filePath, imgBuffer)
            resolve(filePath)
          }
          catch {
            reject(new Error('创建封面图失败'))
          }

          return
        }
        setTimeout(check, 200)
      }
    }
    check()

    return promise
  }

  /**
   * 检查目录是否存在后复制文件
   */
  static async copyFileWithDirCheck(oldPath: string, newPath: string) {
    // 获取目标文件路径中的目录部分
    const dir = dirname(newPath)
    try {
      // 尝试获取目录信息，如果目录不存在会抛出错误
      await access(dir, constants.F_OK)
    }
    catch {
      // 如果目录不存在，就创建它
      await mkdir(dir, { recursive: true })
    }
    // 目录存在或者已经成功创建后，执行文件复制操作
    await copyFile(oldPath, newPath)
  }

  // eslint-disable-next-line node/prefer-global/buffer
  static async bufferToFile(buffer: Buffer, filePath: string): Promise<void> {
    try {
    // 1. 解析 filePath 的目录部分
      const dir = dirname(filePath)

      // 2. 检测目录是否存在，不存在则递归创建
      // recursive: true 确保即使多级目录不存在（如 a/b/c）也能一并创建
      await mkdir(dir, { recursive: true })

      // 3. 把 buffer 写入文件
      // 这会自动处理文件名和后缀
      await writeFile(filePath, buffer)

      console.log(`文件已成功保存至: ${filePath}`)
    }
    catch (error) {
      console.error('保存文件时出错:', error)
      throw error
    }
  }

  // eslint-disable-next-line node/prefer-global/buffer
  static async getPcmDuration(buffer: Buffer) {
    const metadata = await parseBuffer(buffer, 'audio/mpeg')
    return ~~(metadata.format.duration ?? 0) // 返回值单位是秒 (seconds)
  }
}
