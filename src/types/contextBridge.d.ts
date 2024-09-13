import type { ConfigType } from '../defaultConfig'

export interface ContextBridgeApiType {
  configUpdate: (config: ConfigType) => void
}
