import { exec } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { access, constants, copyFile, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join } from 'node:path'
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
		} catch {
			// 如果目录不存在，就创建它
			await mkdir(dir, { recursive: true })
		}
		// 目录存在或者已经成功创建后，执行文件复制操作
		await copyFile(oldPath, newPath)
	}

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
		} catch (error) {
			console.error('保存文件时出错:', error)
			throw error
		}
	}

	static async getAudioDuration(buffer: Buffer) {
		const metadata = await parseBuffer(buffer, 'audio/mpeg')
		return ~~(metadata.format.duration ?? 0) // 返回值单位是秒 (seconds)
	}

	/**
	 * 转换/重新编码 MP3 文件（默认输出到 Windows 临时目录）
	 */
	static async convertToMp3(
		inputPath: string,
		outputPath?: string,
		options = {
			bitrate: 128,
			sampleRate: 44100,
			channels: 2,
		},
	) {
		// 验证输入文件是否存在
		try {
			await access(inputPath)
		} catch {
			throw new Error(`输入文件不存在: ${inputPath}`)
		}

		// 处理输出路径：未传则使用 Windows 临时目录生成唯一文件名
		let finalOutputPath = outputPath
		if (!finalOutputPath) {
			// 获取 Windows 临时目录（C:\Users\[用户名]\AppData\Local\Temp）
			const tempDir = tmpdir()
			// 生成唯一文件名（避免冲突）
			const uniqueName = `converted_mp3_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`
			finalOutputPath = join(tempDir, uniqueName)
		}

		// 确保输出目录存在（如果用户自定义了输出路径）
		const outputDir = dirname(finalOutputPath)
		if (!existsSync(outputDir)) {
			mkdirSync(outputDir, { recursive: true })
		}

		// 构建 FFmpeg 命令（重新编码为标准 MP3 格式）
		const ffmpegCmd = `ffmpeg -i "${inputPath}" 
    -codec:a libmp3lame 
    -b:a ${options.bitrate}k 
    -ar ${options.sampleRate} 
    -ac ${options.channels} 
    -y 
    -hide_banner 
    -loglevel error 
    "${finalOutputPath}"`
			.replace(/\s+/g, ' ')
			.trim()

		return new Promise((resolve, reject) => {
			exec(ffmpegCmd, async (error, _, stderr) => {
				// 错误处理
				if (error) {
					console.error('转换失败:', error.message)
					if (stderr) console.error('FFmpeg 错误详情:', stderr)
					reject(new Error(`转换失败: ${error.message}`))
					return
				}

				// 验证输出文件是否生成并返回文件路径
				try {
					await access(finalOutputPath)
					// 直接返回转换后的文件路径（核心需求）
					resolve(finalOutputPath)
				} catch {
					reject(new Error(`转换命令执行成功，但输出文件未生成: ${finalOutputPath}`))
				}
			})
		})
	}
}
