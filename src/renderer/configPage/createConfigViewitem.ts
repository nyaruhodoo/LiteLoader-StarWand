import type { ConfigType } from '@/defaultConfig'
import type { ConfigItemType } from './config'
import { Utils } from '@/utils'
import { Input } from './components/input'
import { SettingSwitch } from './components/settingSwitch'

export const createConfigViewItem = (item: ConfigItemType, responsiveConfig: ConfigType) => {
  // 初始化容器
  const configItemEl = document.createElement('setting-item')
  configItemEl.setAttribute('data-direction', 'row')
  configItemEl.innerHTML = '<div class="setting-item-text"></div>'

  // 创建标题
  {
    const textBoxEl = configItemEl.querySelector('.setting-item-text')
    const titleEl = document.createElement('setting-text')

    titleEl.innerHTML = item.title
    textBoxEl!.append(titleEl)

    if (item.description) {
      const descriptionEl = document.createElement('setting-text')
      descriptionEl.setAttribute('data-type', 'secondary')
      descriptionEl.innerHTML = item.description
      textBoxEl!.append(descriptionEl)
    }
  }

  // 创建控件
  {
    let element: HTMLElement
    const update = Utils.setProperty.bind(null, responsiveConfig)

    switch (item.type) {
      case 'setting-switch':
        element = SettingSwitch({
          config: item,
          update
        })
        break
      case 'input':
        element = Input({
          config: item,
          update
        })
        break
      default:
        // eslint-disable-next-line no-case-declarations
        const _exhaustiveCheck: never = item.type
        return _exhaustiveCheck
    }

    configItemEl.append(element)
  }

  return configItemEl
}
