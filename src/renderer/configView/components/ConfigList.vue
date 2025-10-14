<script lang="ts" setup>
import { useAttr } from '../hooks'

const { title, collapsible, collapsibleTitle, disabled } = defineProps<{
  title?: string
  collapsible?: boolean
  collapsibleTitle?: string
  disabled?: boolean
}>()

const isDisabled = useAttr('is-disabled', () => disabled)
const isCollapsible = useAttr('is-collapsible', () => collapsible)
</script>

<template>
  <setting-section :data-title="title" v-bind="isDisabled">
    <setting-panel>
      <setting-list :data-title="collapsibleTitle" data-direction="column" v-bind="isCollapsible">
        <slot />
      </setting-list>
    </setting-panel>
  </setting-section>
</template>
