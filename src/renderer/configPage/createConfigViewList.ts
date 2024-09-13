import type { ConfigType } from '@/defaultConfig'
import { createConfigViewConfig } from './config'
import { createConfigViewItem } from './createConfigViewitem'

/**
 * 生成配置对象关联 View
 */
export const createConfigViewList = (responsiveConfig: ConfigType) => {
  // 为了关联配置和View，还需要另一个配置对象 /(ㄒoㄒ)/~~
  const configViewConfig = createConfigViewConfig(responsiveConfig)

  return configViewConfig.map(({ title, list, foldTitle }) => {
    const settingSectionEl = document.createElement('setting-section')
    if (title) {
      settingSectionEl.setAttribute('data-title', title)
    }

    settingSectionEl.innerHTML = `
      <setting-panel>
        <setting-list data-direction="column"></setting-list>
      </setting-panel>
    `
    const settingListEl = settingSectionEl.querySelector('setting-list')

    if (foldTitle) {
      settingListEl?.setAttribute('is-collapsible', 'true')
      settingListEl?.setAttribute('data-title', foldTitle)
    }

    for (const item of list) {
      settingListEl?.append(createConfigViewItem(item, responsiveConfig))
    }

    return settingSectionEl
  })
}
