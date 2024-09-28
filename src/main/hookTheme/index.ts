import { Utils } from '@/utils'
import { EventEnum } from '../enum/eventEnum'
import { listenerMap } from '../hook/hookWrapper'
import { slug } from '@/manifest'
import { readFileSync, existsSync } from 'node:fs'
import type { ConfigType } from '@/defaultConfig'
// import { inspect } from 'node:util'

let currentThemeTokenMap: ColorMap['tokenMap'] | undefined
let systemThemePackageList: ThemePackage[] | undefined

const convertMapAndObject = (data: Record<string, any> | Map<string, any>) => {
  if (data instanceof Map) {
    // Map 转换为 Object
    const obj = {}
    for (const [key, value] of data) {
      obj[key] = value
    }
    return obj
  } else if (typeof data === 'object' && data !== null) {
    // Object 转换为 Map
    const map = new Map()
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        map.set(key, data[key])
      }
    }
    return map
  } else {
    throw new Error('输入必须是 Map 或 Object')
  }
}

const findThemeById = (themeId: number, systemThemePackageList: ThemePackage[]): Theme | undefined => {
  for (const themePackage of systemThemePackageList) {
    const foundTheme = themePackage.themeList.find((theme) => theme.themeId === themeId)
    if (foundTheme) return foundTheme
  }
  return undefined
}

const onThemeInfoChange = async (themeInfo: SetThemeInfoParams) => {
  const skinListener = listenerMap.get('NodeIQQNTWrapperSession/create/getSkinService/addKernelSkinListener')
  if (!skinListener || !systemThemePackageList) return
  const themeId = themeInfo[0]
  let theme = findThemeById(themeInfo[0], systemThemePackageList)
  // BUG: 修正DIY主题，修尼玛的屁
  if (!theme) {
    theme = {
      themeId,
      themeName: themeInfo[2].themeName,
      themeDesc: '',
      requirement: 0,
      themeMediaPreview: '',
      themeVideo: '',
      themePalette: '',
      themePreviewLight: '',
      themePreviewDark: '',
      light: {
        primaryColor: themeInfo[2].primaryColor,
        aioInfo: themeInfo[2].aioInfo,
        bubbleInfo: themeInfo[2].bubbleInfo
      },
      dark: {
        primaryColor: themeInfo[2].primaryColor,
        aioInfo: themeInfo[2].aioInfo,
        bubbleInfo: themeInfo[2].bubbleInfo
      }
    }
  }

  // console.log('onThemeInfoChange')
  // console.log(
  //   inspect(theme, {
  //     depth: null,
  //     colors: true
  //   })
  // )

  const params: ThemeInfoChangeParams = [themeId, theme, null, null, currentThemeTokenMap!]
  // 不得不缓存到本地了
  await Utils.updateConfig({
    theme: [themeId, theme, null, null, convertMapAndObject(currentThemeTokenMap!)]
  })
  skinListener.onThemeInfoChange(...params)
}

export const themeEventInterceptors = {
  async [`${EventEnum.getSystemThemePackageList}:response`](themeList: Promise<SystemThemePackageList>) {
    systemThemePackageList = (await themeList).systemThemePackageList

    return themeList
  },
  // 用来获取当主题的 TokenMap，当对主题进行DIY时也会调用这个
  async [`${EventEnum.previewTheme}:response`](colorMap: Promise<ColorMap>) {
    currentThemeTokenMap = (await colorMap).tokenMap
    return colorMap
  },

  /**
   * 正常主题直接取themeId就行，但是自定义主题还需要这里的 aioInfo
   * 第2个参数时有时无，我也看不出来有啥用
   */
  [EventEnum.setThemeInfo](themeInfo: SetThemeInfoParams) {
    // console.log('setThemeInfo')
    // console.log(
    //   inspect(themeInfo, {
    //     depth: null,
    //     colors: true
    //   })
    // )

    onThemeInfoChange(themeInfo)
  },
  // 其实没什么用，但是可以避免一个弹框提示
  async [`${EventEnum.setThemeInfo}:response`]() {
    return {
      result: 0,
      errMsg: ''
    }
  },
  [EventEnum.onThemeInfoChange](params: ThemeInfoChangeParams) {
    const configPath = `${LiteLoader.plugins[slug].path.data}/config.json`
    if (!existsSync(configPath)) return params

    try {
      // 怎么想都感觉不是很合适，但除此之外没有其他同步的方案了/(ㄒoㄒ)/~~
      const config: ConfigType = JSON.parse(readFileSync(`${LiteLoader.plugins[slug].path.data}/config.json`, 'utf8'))
      if (!config.theme) return
      const configThemeId = config.theme[0]

      if (params[0] !== configThemeId) {
        config.theme[4] = convertMapAndObject(config.theme[4])
        return config.theme
      }

      return params
    } catch (error) {
      console.log(error)
    }

    return params
  }
}
