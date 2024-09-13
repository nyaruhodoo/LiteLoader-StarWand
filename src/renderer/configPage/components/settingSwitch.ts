import type { ConfigItemType } from '../config'

export const SettingSwitch = ({
  config,
  update
}: {
  config: ConfigItemType
  update: (keyPath: string, newVal: boolean) => void
}) => {
  const element: HTMLElement = document.createElement(config.type)

  if (config.value) {
    element.setAttribute('is-active', 'true')
  }
  element.addEventListener('click', function () {
    const isActive = element.hasAttribute('is-active')
    element.toggleAttribute('is-active')
    update(config.keyPath, !isActive)
  })

  return element
}
