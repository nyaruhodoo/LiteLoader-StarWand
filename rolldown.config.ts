import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import { cwd } from 'node:process'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'rolldown'
import postcss from 'rollup-plugin-postcss'

const require = createRequire(import.meta.url)

const MAIN_OUT_DIR = 'dist/main'
/** 记录每个包上次复制时的版本，命中即可跳过整轮复制 */
const COPY_MANIFEST_FILE = '.copy-manifest.json'

/** 读取 JSON 文件并确保顶层是对象（避免对 any 做类型断言） */
function readJsonObject(filePath: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'))

  if (typeof parsed !== 'object' || parsed === null) {
    throw new TypeError(`${filePath} 的顶层不是 JSON 对象`)
  }

  return Object.fromEntries(Object.entries(parsed))
}

/** 递归检查目录里是否还有原生二进制（.node / .dll），用于判断上次复制是否完整 */
function hasNativeBinary(dir: string): boolean {
  if (!existsSync(dir)) return false

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (hasNativeBinary(join(dir, entry.name))) return true
    } else if (/\.(?:node|dll)$/i.test(entry.name)) {
      return true
    }
  }

  return false
}

export default defineConfig([
  {
    input: 'src/main/index.ts',
    output: {
      format: 'cjs',
      dir: MAIN_OUT_DIR,
      minify: true,
      // 手动清理（见下方 writeBundle）：cleanDir 会把 node_modules 一起删掉，导致每轮重拷依赖
      cleanDir: false,
    },
    platform: 'node',
    tsconfig: './tsconfig.node.json',
    external: ['electron', 'koffi', '@acidify/codec', /\.node$/],
    plugins: [
      {
        name: 'main-clean-and-copy-deps',
        // 产物写完后才清理上一轮遗留的 chunk，保留 node_modules 与复制清单；
        // 放在 writeBundle 而不是 buildStart，编译失败时旧产物依然可用
        writeBundle(outputOptions, bundle) {
          const outDir = resolve(cwd(), outputOptions.dir ?? MAIN_OUT_DIR)
          if (!existsSync(outDir)) return

          const keep = new Set<string>(['node_modules', COPY_MANIFEST_FILE])
          for (const fileName of Object.keys(bundle)) {
            const [topLevel] = fileName.split('/')
            if (topLevel) keep.add(topLevel)
          }

          for (const entry of readdirSync(outDir)) {
            if (keep.has(entry)) continue
            rmSync(join(outDir, entry), { recursive: true, force: true })
          }
        },
        async closeBundle() {
          const packagesToCopy = [
            { name: '@acidify/codec', keep: 'win32-x64', targetSubDir: 'lib' },
            { name: 'koffi', keep: 'win32_x64', targetSubDir: 'build' },
          ]

          // 定义递归拷贝函数
          const smartCopy = (src: string, dest: string, pkgConfig: Record<string, any>) => {
            const stats = statSync(src)
            const relPath = relative(pkgConfig.root, src).replace(/\\/g, '/')

            // 逻辑判断：是否是需要过滤的子目录区域
            const isInTargetArea = relPath.startsWith(pkgConfig.targetSubDir)

            if (stats.isDirectory()) {
              // 如果在目标区域（如 lib/ 或 build/）
              if (isInTargetArea) {
                // 如果文件夹名本身包含我们要的关键字（例如 lib/win32-x64），则整体拷贝
                if (relPath.includes(pkgConfig.keep)) {
                  mkdirSync(dest, { recursive: true })
                  const files = readdirSync(src)
                  files.forEach((f) => smartCopy(join(src, f), join(dest, f), pkgConfig))
                } else {
                  // 如果文件夹名不包含关键字，但它是父级路径（例如 lib 目录本身），则继续往下找，但不创建目录
                  const files = readdirSync(src)
                  files.forEach((f) => smartCopy(join(src, f), join(dest, f), pkgConfig))
                }
              } else {
                // 不在过滤区域（如 dist/ 或 package.json），直接创建并继续
                if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
                const files = readdirSync(src)
                files.forEach((f) => smartCopy(join(src, f), join(dest, f), pkgConfig))
              }
            } else {
              // 如果是文件
              // 规则：如果在过滤区，必须包含关键字；如果不在过滤区，直接拷贝
              const shouldCopyFile = !isInTargetArea || relPath.includes(pkgConfig.keep)
              if (shouldCopyFile) {
                mkdirSync(dirname(dest), { recursive: true })
                copyFileSync(src, dest)
              }
            }
          }

          const manifestPath = resolve(cwd(), MAIN_OUT_DIR, COPY_MANIFEST_FILE)
          const prevManifest: Record<string, unknown> = existsSync(manifestPath)
            ? readJsonObject(manifestPath)
            : {}
          const nextManifest: Record<string, string> = {}

          for (const pkg of packagesToCopy) {
            try {
              const pkgJsonPath = require.resolve(`${pkg.name}/package.json`)
              const pkgRoot = dirname(pkgJsonPath)
              const { version } = readJsonObject(pkgJsonPath)

              if (typeof version !== 'string') {
                throw new TypeError(`${pkg.name} 的 package.json 缺少 version 字段`)
              }

              const destRoot = resolve(cwd(), MAIN_OUT_DIR, 'node_modules', pkg.name)

              // 版本没变、且上次复制出来的二进制还在 → 直接跳过
              if (prevManifest[pkg.name] === version && hasNativeBinary(destRoot)) {
                console.log(`⏭  ${pkg.name}@${version} 已存在且版本未变，跳过复制`)
                nextManifest[pkg.name] = version
                continue
              }

              console.log(`\n🧹 Cleaning and Copying ${pkg.name}@${version}...`)

              if (existsSync(destRoot)) {
                rmSync(destRoot, { recursive: true, force: true })
              }

              // 启动手动递归扫描
              smartCopy(pkgRoot, destRoot, { ...pkg, root: pkgRoot })

              console.log(`  ✨ Done! No empty directories left in ${pkg.name}`)
              nextManifest[pkg.name] = version
            } catch (err) {
              console.error(`❌`, err)
            }
          }

          writeFileSync(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`)
        },
      },
    ],
  },
  {
    input: 'src/preload/index.ts',
    output: {
      format: 'cjs',
      dir: 'dist/preload',
      minify: true,
      cleanDir: true,
    },
    platform: 'node',
    tsconfig: './tsconfig.node.json',
    external: ['electron'],
  },
  {
    input: 'src/renderer/index.ts',
    output: {
      format: 'es',
      dir: 'dist/renderer',
      minify: true,
      cleanDir: true,
    },
    platform: 'browser',
    tsconfig: './tsconfig.web.json',
    // rolldown 1.3 移除了实验性 CSS 打包，不声明的话 .css 会直接报 UNSUPPORTED_FEATURE；
    // 交给下面 rollup-plugin-postcss 处理
    moduleTypes: { '.css': 'js' },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // 只把 setting-* 前缀的标签视为自定义元素（QQNT 注入的 Web Components）
            isCustomElement: (tag) => tag.startsWith('setting-'),
          },
        },
      }),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
  },
])
