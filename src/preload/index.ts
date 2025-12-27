import type { ConfigType } from 'src/defaultConfig'
import type { ContextBridgeApiType } from '@/types/contextBridge'
import { contextBridge, ipcRenderer } from 'electron'
import { slug } from '@/manifest'

const contextBridgeApi: ContextBridgeApiType = {
  configUpdate(config: ConfigType) {
    ipcRenderer.send(`${slug}:update`, config)
  },
  'starWand:session-invoke-method': async function (serviceFnPath: string, params: unknown[]) {
    const res = await ipcRenderer.invoke(
      'starWand:session-invoke-method', // 和主进程监听的通道名保持一致
      { serviceFnPath, params }, // 按主进程要求传递对象参数
    )

    return res
  },
}

contextBridge.exposeInMainWorld(slug, contextBridgeApi)
