<script setup lang="ts">
import type { ContextBridgeApiType } from '@/types/contextBridge'
import { defaultConfig } from 'src/defaultConfig'
import { Utils } from 'src/utils'
import { reactive, toRefs, watch } from 'vue'
import { slug } from '@/manifest'
import ConfigItem from './components/ConfigItem.vue'
import ConfigList from './components/ConfigList.vue'
import NInput from './components/NInput.vue'
import NSwitch from './components/NSwitch.vue'

// @ts-expect-error  忽略错误
const contextBridgeApi = window[slug] as ContextBridgeApiType

const configReactive = reactive(defaultConfig)
const { redPackTextBlacklist, groupBlacklist, senderBlacklist, randomDelay, autoSendmsg, minimumAmount, skipPwd } = toRefs(configReactive)

;(async () => {
  const newConfig = await Utils.getConfig('renderer')
  for (const key in newConfig) {
    // @ts-expect-error  忽略错误
    configReactive[key] = newConfig[key]
  }
})()

/**
 * 监听config变动
 */
watch(configReactive, (newVal) => {
  const copyVal = JSON.parse(JSON.stringify(newVal))
  Utils.updateConfig(copyVal, 'renderer')
  // 每次配置更新后通知主线程和渲染线程
  contextBridgeApi.configUpdate(copyVal)
  new BroadcastChannel(slug).postMessage(copyVal)
})

async function openDevTools() {
  const res = await contextBridgeApi['starWand:session-invoke-method'](
    'getSettingService/openUrlInIM',
    ['https://nyaruhodoo.github.io/qwqnt-star-wand-devtools/'],
  )
  console.log(res)
}
</script>

<template>
  <ConfigList title="抢红包">
    <ConfigItem title="关键字黑名单" tip="使用&进行分割">
      <NInput v-model="redPackTextBlacklist" />
    </ConfigItem>
    <ConfigItem title="群号黑名单" tip="使用&进行分割">
      <NInput v-model="groupBlacklist" />
    </ConfigItem>
    <ConfigItem title="Q号黑名单" tip="使用&进行分割">
      <NInput v-model="senderBlacklist" />
    </ConfigItem>
    <ConfigItem title="最小延迟(ms)">
      <NInput v-model.number="randomDelay.min" />
    </ConfigItem>
    <ConfigItem title="最大延迟(ms)">
      <NInput v-model.number="randomDelay.max" />
    </ConfigItem>
    <ConfigItem title="领取成功后随机回复" tip="使用&进行分割">
      <NInput v-model="autoSendmsg" />
    </ConfigItem>
    <ConfigItem title="低于指定金额不自动回复(分)">
      <NInput v-model.number="minimumAmount" />
    </ConfigItem>
    <ConfigItem title="跳过发言领取口令红包">
      <NSwitch v-model="skipPwd" />
    </ConfigItem>
  </ConfigList>

  <ConfigList title="杂项">
    <ConfigItem title="DevTools">
      <a href="https://nyaruhodoo.github.io/qwqnt-star-wand-devtools/" @click.prevent="openDevTools">在线地址</a>
    </ConfigItem>
  </ConfigList>
</template>

<style scoped>
</style>
