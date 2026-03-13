<script setup lang="ts">
import { defaultConfig } from 'src/defaultConfig'
import { Utils } from 'src/utils'
import { reactive, toRefs, watch } from 'vue'
import { slug } from '@/manifest'
import type { ContextBridgeApiType } from '@/types/contextBridge'
import ConfigItem from './components/ConfigItem.vue'
import ConfigList from './components/ConfigList.vue'
import NInput from './components/NInput.vue'
import NSwitch from './components/NSwitch.vue'

// @ts-expect-error  忽略错误
const contextBridgeApi = window[slug] as ContextBridgeApiType

const configReactive = reactive(defaultConfig)
const {
	redPackTextBlacklist,
	groupBlacklist,
	senderBlacklist,
	randomDelay,
	autoSendmsg,
	minimumAmount,
	skipPwd,
	messageBlock,
	messageMonitor,
} = toRefs(configReactive)

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
	const port = await contextBridgeApi['starWand:get-port']()
	const res = await contextBridgeApi['starWand:session-invoke-method']('getSettingService/openUrlInIM', [
		`https://nyaruhodoo.github.io/qwqnt-star-wand-devtools?port=${port}`,
	])
	Utils.log(res)
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

  <ConfigList title="群消息屏蔽">
    <ConfigItem title="关键字" tip="使用&进行分割">
      <NInput v-model="messageBlock.keywordBlacklist" />
    </ConfigItem>
    <ConfigItem title="视频">
      <NSwitch v-model="messageBlock.blockVideo" />
    </ConfigItem>
    <ConfigItem title="图片">
      <NSwitch v-model="messageBlock.blockImage" />
    </ConfigItem>
    <ConfigItem title="表情">
      <NSwitch v-model="messageBlock.blockEmoji" />
    </ConfigItem>
    <ConfigItem title="捏一捏">
      <NSwitch v-model="messageBlock.blockPoke" />
    </ConfigItem>
    <ConfigItem title="表情回应">
      <NSwitch v-model="messageBlock.blockEmojiReply" />
    </ConfigItem>
    <ConfigItem title="大表情">
      <NSwitch v-model="messageBlock.blockSolitaire" />
    </ConfigItem>
    <ConfigItem title="机器人">
      <NSwitch v-model="messageBlock.blockRobot" />
    </ConfigItem>
    <ConfigItem title="@所有人">
      <NSwitch v-model="messageBlock.blockAtAll" />
    </ConfigItem>
    <ConfigItem title="白名单" tip="使用&进行分割(名单内的群将不会被屏蔽)">
      <NInput v-model="messageBlock.whitelist" />
    </ConfigItem>
  </ConfigList>

  <ConfigList title="群消息监听">
    <ConfigItem title="关键字" tip="使用&进行分割">
      <NInput v-model="messageMonitor.keyword" />
    </ConfigItem>
    <ConfigItem title="特别关心" tip="使用&进行分割(填写你暗恋的人Q号)">
      <NInput v-model="messageMonitor.favoriteList" />
    </ConfigItem>
    <ConfigItem title="白名单" tip="使用&进行分割(只有配置群起作用，也可以选择*表示全部)">
      <NInput v-model="messageMonitor.whitelist" />
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
