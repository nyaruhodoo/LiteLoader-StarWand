import type { ConfigType } from '@/defaultConfig'

export interface ContextBridgeApiType {
  configUpdate: (config: ConfigType) => void
  'starWand:session-invoke-method': (
    serviceFnPath: string,
    params: unknown[],
  ) => Promise<{
    success: 0 | 1
    error: Error | string
    data?: unknown
  }>
  'starWand:get-debug-info': () => Promise<{ port: number; token: string }>
}
