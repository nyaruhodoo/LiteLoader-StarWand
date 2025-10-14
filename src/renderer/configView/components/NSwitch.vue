<script lang="ts" setup>
import { useAttr } from '../hooks'

const model = defineModel<boolean>()
const isActive = useAttr('is-active', model)
</script>

<template>
  <setting-switch v-bind="isActive" @click="model = !model" />
</template>
