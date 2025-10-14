import { computed, toValue } from 'vue'

/**
 * 解决渲染 Web Components 时无法识别布尔值属性
 */
export function useAttr(attrName: string, val: any) {
  return computed(() => {
    if (toValue(val)) {
      return {
        [attrName]: true,
      }
    }
    return {}
  })
}
