<script lang="ts" setup>
import { useTemplateRef, watch } from 'vue'

type Options = {
  label: string
  value?: string
  disabled?: boolean
}[]

const { options } = defineProps<{
  options: Options
}>()

const input = useTemplateRef('select')

const model = defineModel<string>()
function onSelected(val: {
  detail: {
    name: string
    value: string
  }
}) {
  const {
    detail: { value },
  } = val
  model.value = value
}

function createAttr(item: Options['0']) {
  const ret: {
    'is-selected'?: boolean
    'is-disabled'?: boolean
  } = {}
  if ((item.value ?? item.label) === model.value) {
    ret['is-selected'] = true
  }
  if (item.disabled) {
    ret['is-disabled'] = true
  }
  return ret
}

watch(model, (val) => {
  ;(input.value as any)._title.value = val
})
</script>

<template>
  <setting-select ref="select" @selected="onSelected">
    <setting-option
      v-for="item of options"
      :key="item.label"
      :data-value="item.value ?? item.label"
      v-bind="createAttr(item)"
    >
      {{ item.label }}
    </setting-option>
  </setting-select>
</template>
