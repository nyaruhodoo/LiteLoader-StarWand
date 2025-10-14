<script lang="ts" setup>
import type { InputTypeHTMLAttribute } from 'vue'

const inputProps = defineProps<{
  type?: InputTypeHTMLAttribute
  placeholder?: string
  minLength?: number | string
  maxLength?: number | string
  width?: string | number
}>()
const model = defineModel<string | number>()
</script>

<template>
  <div
    class="border border-solid border-[var(--border\_dark)] focus-within:border-[var(--brand\_standard)] rounded-[4px] text-[12px] leading-[26px] px-[8px]"
    :style="{
      width: inputProps.width,
    }"
  >
    <input v-model="model" class="text-center" v-bind="inputProps">
  </div>
</template>
