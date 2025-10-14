import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

const styleUrl = new URL('./index.css', import.meta.url).href

export function onSettingWindowCreated(view: HTMLElement) {
  const css = document.createElement('link')
  css.rel = 'stylesheet'
  css.href = styleUrl
  document.head.append(css)

  createApp(App).mount(view)
}
