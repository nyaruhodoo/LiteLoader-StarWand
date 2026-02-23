import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import { cwd } from 'node:process'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'rolldown'
import postcss from 'rollup-plugin-postcss'

const require = createRequire(import.meta.url)

export default defineConfig([
  {
    input: 'src/main/index.ts',
    output: {
      format: 'cjs',
      dir: 'dist/main',
      minify: true,
      cleanDir: true,
    },
    platform: 'node',
    tsconfig: './tsconfig.node.json',
    external: [
      'electron',
      'koffi',
      '@acidify/codec',
      /\.node$/,
    ],
    plugins: [
      {
        name: 'manual-copy-deps-perfect',
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
                  files.forEach(f => smartCopy(join(src, f), join(dest, f), pkgConfig))
                }
                else {
                  // 如果文件夹名不包含关键字，但它是父级路径（例如 lib 目录本身），则继续往下找，但不创建目录
                  const files = readdirSync(src)
                  files.forEach(f => smartCopy(join(src, f), join(dest, f), pkgConfig))
                }
              }
              else {
                // 不在过滤区域（如 dist/ 或 package.json），直接创建并继续
                if (!existsSync(dest))
                  mkdirSync(dest, { recursive: true })
                const files = readdirSync(src)
                files.forEach(f => smartCopy(join(src, f), join(dest, f), pkgConfig))
              }
            }
            else {
              // 如果是文件
              // 规则：如果在过滤区，必须包含关键字；如果不在过滤区，直接拷贝
              const shouldCopyFile = !isInTargetArea || relPath.includes(pkgConfig.keep)
              if (shouldCopyFile) {
                mkdirSync(dirname(dest), { recursive: true })
                copyFileSync(src, dest)
              }
            }
          }

          for (const pkg of packagesToCopy) {
            try {
              const pkgRoot = dirname(require.resolve(`${pkg.name}/package.json`))
              const destRoot = resolve(cwd(), 'dist/main/node_modules', pkg.name)

              console.log(`\n🧹 Cleaning and Copying ${pkg.name}...`)

              if (existsSync(destRoot)) {
                rmSync(destRoot, { recursive: true, force: true })
              }

              // 启动手动递归扫描
              smartCopy(pkgRoot, destRoot, { ...pkg, root: pkgRoot })

              console.log(`  ✨ Done! No empty directories left in ${pkg.name}`)
            }
            catch (err) {
              console.error(`❌`, err)
            }
          }
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
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // 将所有带短横线的标签名都视为自定义元素
            isCustomElement: tag => tag.includes('-'),
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
