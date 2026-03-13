import { contextBridge, ipcRenderer } from 'electron'
import type { ConfigType } from 'src/defaultConfig'
import { slug } from '@/manifest'
import type { ContextBridgeApiType } from '@/types/contextBridge'

const contextBridgeApi: ContextBridgeApiType = {
	configUpdate(config: ConfigType) {
		ipcRenderer.send(`${slug}:update`, config)
	},
	'starWand:session-invoke-method': async (serviceFnPath: string, params: unknown[]) => {
		const res = await ipcRenderer.invoke(
			'starWand:session-invoke-method', // 和主进程监听的通道名保持一致
			{ serviceFnPath, params }, // 按主进程要求传递对象参数
		)

		return res
	},
	'starWand:get-port': async () => {
		const res = await ipcRenderer.invoke('starWand:get-port')
		return res
	},
}

contextBridge.exposeInMainWorld(slug, contextBridgeApi)
