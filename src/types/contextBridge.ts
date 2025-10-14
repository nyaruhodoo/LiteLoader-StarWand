import type { ConfigType } from 'src/defaultConfig'

export interface ContextBridgeApiType {
  configUpdate: (config: ConfigType) => void
}
