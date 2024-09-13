import type { ConfigItemType } from '../config'

export const Input = ({
  config,
  update
}: {
  config: ConfigItemType
  update: (keyPath: string, newVal: any) => void
}) => {
  const element: HTMLInputElement = document.createElement('input')

  element.type = config.inputType ?? 'text'
  element.value = config.value

  element.addEventListener('change', () => {
    const value = config.customStoreFormat ? config.customStoreFormat(element.value) : element.value

    update(config.keyPath, value)
  })

  return element
}
