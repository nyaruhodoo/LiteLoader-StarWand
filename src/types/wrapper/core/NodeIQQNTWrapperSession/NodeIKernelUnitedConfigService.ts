interface UnitedConfigListener {
  /**
   * 当联合配置更新时调用的回调函数
   */
  onUnitedConfigUpdate: () => void
}

export interface NodeIKernelUnitedConfigService {
  addKernelUnitedConfigListener: (listener: UnitedConfigListener) => void
  removeKernelUnitedConfigListener: (listener: UnitedConfigListener) => void
  fetchUnitedCommendConfig: () => Promise<any> // 根据实际返回值类型调整
  fetchUnitedSwitchConfig: () => Promise<any> // 根据实际返回值类型调整
  loadUnitedConfig: (params: string) => WrapperAsyncResponse<{
    configData: {
      group: string
      content: string
      isSwitchOn: boolean
      code: number
      isCdn: boolean
      resourcePath: null
    }
  }>
  isUnitedConfigSwitchOn: () => boolean
  registerUnitedConfigPushGroupList: (groupList: string[]) => void
}
