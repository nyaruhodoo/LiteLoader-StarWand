<script lang="ts" setup>
import { useAttr } from '../hooks'

const { title, tip, disabled } = defineProps<{
  title: string
  tip?: string
  disabled?: boolean
}>()
const isDisabled = useAttr('is-disabled', () => disabled)
</script>

<template>
  <setting-item data-direction="row" v-bind="isDisabled">
    <div>
      <setting-text>{{ title }}</setting-text>
      <setting-text v-if="tip" data-type="secondary">
        {{ tip }}
      </setting-text>
    </div>
    <slot />
  </setting-item>
</template>
