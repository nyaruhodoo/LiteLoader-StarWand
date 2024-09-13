import type { ConfigType } from '@/defaultConfig'

export type ComponentType = 'input' | 'setting-switch'

export interface ConfigItemType<T = any> {
  title: string
  description?: string
  type: ComponentType
  inputType?: 'text' | 'number'
  keyPath: string
  value: T
  customStoreFormat?: (value: string) => T
}

/**
 * 生成创建 View 的配置项
 */
export const createConfigViewConfig = (
  responsiveConfig: ConfigType
): {
  title?: string
  list: ConfigItemType[]
  foldTitle?: string
}[] => {
  return [
    {
      title: '配置标题',
      foldTitle: '123',
      list: [
        {
          title: '配置项',
          type: 'setting-switch',
          inputType: 'text',
          keyPath: 'test',
          value: responsiveConfig.test
        }
      ]
    }
  ]
}
