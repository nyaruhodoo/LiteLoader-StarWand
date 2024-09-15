export interface ConfigType {
  // 干哦，我真不关心你什么类型
  theme: [number, Record<any, any>, null, null, Record<any, any>] | null
}

export const defaultConfig: ConfigType = {
  theme: null
}
