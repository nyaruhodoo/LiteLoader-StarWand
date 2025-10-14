interface KerneIO3MiscServiceEventCallbacks {
  getOnAmgomDataPiece: (params: string) => boolean
}

export interface NodeIO3MiscService {
  addO3MiscListener: (listener: KerneIO3MiscServiceEventCallbacks) => string
  removeO3MiscListener: (listener: KerneIO3MiscServiceEventCallbacks) => void
  reportCameraToO3: (data: any) => void // 根据实际数据结构替换 `any`
  reportAmgomWeather: (p1: string, p2: string, p3: [string, string, string]) => void // 根据实际数据结构替换 `any`
  setAmgomDataPiece: (p1: string, p2: Uint8Array) => void // 根据实际数据结构替换 `any`
  passthroughO3Data: (data: any) => void // 根据实际数据结构替换 `any`
}
