/**
 * 非 TS 资源模块的类型声明。
 * 这些文件由打包器（rolldown + @vitejs/plugin-vue / postcss）处理，
 * 这里只为 `tsc` 类型检查提供模块形状，避免 TS2307 / TS2882。
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '*.css' {
  const content: string
  export default content
}
