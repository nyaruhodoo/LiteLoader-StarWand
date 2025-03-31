export interface ConfigType {
  // 干哦，我真不关心你什么类型
  theme?: [number, Record<any, any>, null, null, Record<any, any>] | null
  clickNum?: Record<string, number> | null
}

export const defaultConfig: ConfigType = {
  theme: null,
  clickNum: null
}
