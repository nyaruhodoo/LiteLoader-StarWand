import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'rolldown'
import postcss from 'rollup-plugin-postcss'

export default defineConfig([
  {
    input: 'src/main/index.ts',
    output: {
      format: 'cjs',
      dir: 'dist/main',
      minify: true,
    },
    platform: 'node',
    tsconfig: './tsconfig.node.json',
    external: ['electron'],
  },
  {
    input: 'src/preload/index.ts',
    output: {
      format: 'cjs',
      dir: 'dist/preload',
      minify: true,
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
