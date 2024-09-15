type SystemThemePackageList = {
  systemThemePackageList: ThemePackage[]
}

type ThemePackage = {
  packageId: number
  packageName: string
  packageSlogan: string
  packageDesc: string
  packageMediaPreview: string
  packageVideo: string
  packagePalette: string
  themeList: Theme[]
}

type Theme = {
  themeId: number
  themeName: string
  themeDesc: string
  requirement: number
  themeMediaPreview: string
  themeVideo: string
  themePalette: string
  themePreviewLight: string
  themePreviewDark: string
  light: ThemeMode
  dark: ThemeMode
}

type ThemeMode = {
  primaryColor: number[]
  aioInfo: AioInfo
  bubbleInfo: BubbleInfo
}

type AioInfo = {
  color: number[]
  texture: Texture
}

type Texture = {
  textureUrl: string
  opaque: number
  layout: number
  blendMode: number
}

type BubbleInfo = {
  color: number[]
}

type ColorMap = {
  tokenMap: Map<string, { lightColor: number; darkColor: number }>
}

type ThemeInfoChangeParams = [number, Theme, null, null, ColorMap['tokenMap']]

type SetThemeInfoParams = [
  number,
  (
    | {
        themeName: string
        colorId: number
        primaryColor: number[]
        thumbnailLight: string
        thumbnailDark: string
      }
    | undefined
  ),
  {
    themeId: number
    themeName: string
    needSVip: boolean
    primaryColor: number[]
    aioInfo: {
      color: number[]
      texture: {
        textureUrl: string
        layout: number
        opaque: number
        blendMode: number
      }
    }
    bubbleInfo: {
      color: number[]
    }
  }
]
