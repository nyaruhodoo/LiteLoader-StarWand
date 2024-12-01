import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { access, constants, copyFile, mkdir } from 'node:fs/promises'
import path, { extname } from 'node:path'

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
  static checkFileExists(filePath: string, interval: number = 200, maxAttempts: number = 10) {
    const { promise, resolve, reject } = Promise.withResolvers()
    let attempts = 0

    const check = async () => {
      attempts++
      try {
        await access(filePath)
        resolve(filePath)
      } catch (_) {
        if (attempts > maxAttempts) {
          reject(new Error('找不到视频封面'))
        }
        setTimeout(check, interval)
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
    const dir = path.dirname(newPath)
    try {
      // 尝试获取目录信息，如果目录不存在会抛出错误
      await access(dir, constants.F_OK)
    } catch (error) {
      // 如果目录不存在，就创建它
      await mkdir(dir, { recursive: true })
    }
    // 目录存在或者已经成功创建后，执行文件复制操作
    await copyFile(oldPath, newPath)
  }
}
