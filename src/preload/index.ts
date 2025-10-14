import type { ConfigType } from 'src/defaultConfig'
import type { ContextBridgeApiType } from '@/types/contextBridge'
import { contextBridge, ipcRenderer } from 'electron'
import { slug } from '@/manifest'

const contextBridgeApi: ContextBridgeApiType = {
  configUpdate(config: ConfigType) {
    ipcRenderer.send(`${slug}:update`, config)
  },
}

contextBridge.exposeInMainWorld(slug, contextBridgeApi)
