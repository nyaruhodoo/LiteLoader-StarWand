import { createApp } from 'vue'

import { Utils } from '../utils'
import App from './App.vue'
import { initializeRendererComponents } from './llComponents/index.js'

import './index.css'

export function onSettingWindowCreated(view: HTMLElement) {
  const css = document.createElement('link')
  css.rel = 'stylesheet'
  css.href = Utils.createStorageUrl('/dist/renderer/index.css')
  document.head.append(css)

  initializeRendererComponents()

  createApp(App).mount(view)
}
