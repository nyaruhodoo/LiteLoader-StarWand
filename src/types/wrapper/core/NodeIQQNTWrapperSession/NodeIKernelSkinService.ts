interface SkinListener {
  /**
   * 当主题信息发生变化时调用的回调函数
   */
  onThemeInfoChange: () => void

  /**
   * 当自定义主题信息发生变化时调用的回调函数
   */
  onCustomThemeInfoChange: () => void
}

export interface NodeIKernelSkinService {
  /**
   * 注册一个监听器，用于接收皮肤相关的事件通知。
   * @param listener - 事件监听器函数
   */
  addKernelSkinListener: (listener: SkinListener) => void

  /**
   * 移除已注册的皮肤事件监听器。
   * @param listener - 要移除的事件监听器函数
   */
  removeKernelSkinListener: (listener: SkinListener) => void

  /**
   * 获取系统主题列表。
   * @returns - 返回系统主题的数组
   */
  getSystemThemeList: () => any[]

  /**
   * 获取系统主题包列表。
   * @returns - 返回系统主题包的数组
   */
  getSystemThemePackageList: () => any[]

  /**
   * 获取模板主题列表。
   * @returns - 返回模板主题的数组
   */
  getTemplateThemeList: () => any[]

  /**
   * 设置模板的自定义主色调。
   * @param color - 自定义的主色调
   */
  setTemplateCustomPrimaryColor: (color: string) => void

  /**
   * 设置主题信息。
   * @param themeInfo - 主题信息对象
   */
  setThemeInfo: (themeInfo: any) => void

  /**
   * 获取主题信息。
   * @param themeId - 主题的唯一标识符
   * @returns - 返回主题信息的对象
   */
  getThemeInfo: (themeId: string) => any

  /**
   * 获取主题历史记录。
   * @returns - 返回主题历史记录的数组
   */
  getThemeHistory: () => any[]

  /**
   * 预览主题
   */
  previewTheme: (
    p1: number,
    p2: undefined,
    p3: undefined
  ) => {
    tokenMap: Map<
      string,
      {
        lightColor: number
        darkColor: number
      }
    >
  }

  /**
   * 从图片中获取主题信息。
   * @param image - 图片对象
   * @returns - 返回从图片中提取的主题信息
   */
  getThemeInfoFromImage: (image: File) => any

  /**
   * 上传图片。
   * @param image - 图片对象
   * @returns - 返回上传结果的对象
   */
  uploadImage: (image: File) => any

  /**
   * 获取推荐的 AIO 颜色。
   * @returns - 返回推荐的 AIO 颜色的数组
   */
  getRecommendAIOColor: () => string[]

  /**
   * 获取推荐的气泡颜色。
   * @returns - 返回推荐的气泡颜色的数组
   */
  getRecommendBubbleColor: () => string[]
}
