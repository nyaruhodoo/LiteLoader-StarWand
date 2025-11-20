import { Button } from './elements/button.js'
import { Divider } from './elements/divider.js'
import { Item } from './elements/item.js'
import { List } from './elements/list.js'
import { Modal } from './elements/modal.js'
import { Option } from './elements/option.js'
import { Panel } from './elements/panel.js'
// 导入组件
import { Section } from './elements/section.js'
import { Select } from './elements/select.js'
import { Switch } from './elements/switch.js'
import { Text } from './elements/text.js'

// 注册所有组件
function registerAll(elements) {
  for (const { tag, element } of elements) {
    if (!customElements.get(tag)) {
      customElements.define(tag, element)
    }
  }
}

// 初始化
export function initializeRendererComponents() {
  registerAll([
    { tag: 'setting-section', element: Section },
    { tag: 'setting-panel', element: Panel },
    { tag: 'setting-list', element: List },
    { tag: 'setting-item', element: Item },
    { tag: 'setting-select', element: Select },
    { tag: 'setting-option', element: Option },
    { tag: 'setting-switch', element: Switch },
    { tag: 'setting-button', element: Button },
    { tag: 'setting-text', element: Text },
    { tag: 'setting-divider', element: Divider },
    { tag: 'setting-modal', element: Modal },
  ])
}
