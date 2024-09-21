import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { access } from 'node:fs/promises'
import { extname } from 'node:path'

export class Utils {
  /**
   * 判断给定文件路径是否是视频
   */
  static isVideoFile(filePath: string) {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpeg', '.mpg', '.3gp']
    const extName = extname(filePath).toLowerCase()
    return videoExtensions.includes(extName)
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
}
