<script setup lang="ts">
import { defaultConfig } from "src/defaultConfig";
import { Utils } from "src/utils";
import { reactive, toRefs, watch } from "vue";
import { slug } from "@/manifest";
import type { ContextBridgeApiType } from "@/types/contextBridge";
import ConfigItem from "./components/ConfigItem.vue";
import ConfigList from "./components/ConfigList.vue";
import NInput from "./components/NInput.vue";
import NSwitch from "./components/NSwitch.vue";

// @ts-expect-error 忽略错误
const contextBridgeApi = window[slug] as ContextBridgeApiType;

const configReactive = reactive(defaultConfig);
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
  emojiPath,
  recentEmojiCountLimit,
  keywordAutoReplyGroupList,
  keywordAutoReplyList,
  enableOCR,
} = toRefs(configReactive);

(async () => {
  const newConfig = await Utils.getConfig("renderer");
  for (const key in newConfig) {
    // @ts-expect-error 忽略错误
    configReactive[key] = newConfig[key];
  }
})();

/**
 * 监听config变动
 */
watch(configReactive, (newVal) => {
  const copyVal = JSON.parse(JSON.stringify(newVal));
  Utils.updateConfig(copyVal, "renderer");
  // 每次配置更新后通知主线程和渲染线程
  contextBridgeApi.configUpdate(copyVal);
  new BroadcastChannel(slug).postMessage(copyVal);
});

async function openDevTools() {
  const port = await contextBridgeApi["starWand:get-port"]();
  const res = await contextBridgeApi["starWand:session-invoke-method"](
    "getSettingService/openUrlInIM",
    [`https://nyaruhodoo.github.io/qwqnt-star-wand-devtools?port=${port}`],
  );
  Utils.log(res);
}

// ---------------- 关键词回复逻辑 ----------------
function addReplyRule() {
  keywordAutoReplyList.value.push({
    keyword: "",
    reply: "",
    disabled: false,
  });
}

function removeReplyRule(index: number) {
  keywordAutoReplyList.value.splice(index, 1);
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

  <ConfigList title="群消息自动回复">
    <ConfigItem title="生效群号" tip="使用&进行分割">
      <NInput v-model="keywordAutoReplyGroupList" />
    </ConfigItem>
    <ConfigItem title="图片识别">
      <NSwitch v-model="enableOCR" />
    </ConfigItem>

    <div class="reply-rules-wrapper">
      <div class="reply-rules-header">
        <span>自动回复规则配置</span>
        <button class="btn btn-add" @click="addReplyRule">+ 添加新规则</button>
      </div>

      <div class="reply-rules-list">
        <div
          v-for="(item, index) in keywordAutoReplyList"
          :key="index"
          class="reply-rule-card"
          :class="{ disabled: item.disabled }"
        >
          <div class="card-header">
            <span class="rule-index">规则 #{{ index + 1 }}</span>
            <div class="card-actions">
              <label class="switch-label">
                <span>{{ item.disabled ? "禁用" : "启用" }}</span>
                <NSwitch v-model="item.disabled" />
              </label>
              <button class="btn btn-delete" @click="removeReplyRule(index)">删除</button>
            </div>
          </div>

          <div class="card-body">
            <ConfigItem title="匹配关键字" tip="使用&进行分割">
              <NInput v-model="item.keyword" />
            </ConfigItem>

            <ConfigItem title="自动回复内容">
              <NInput v-model="item.reply" />
            </ConfigItem>
          </div>
        </div>

        <div v-if="!keywordAutoReplyList.length" class="empty-tip">暂无自动回复规则</div>
      </div>
    </div>
  </ConfigList>

  <ConfigList title="本地表情包">
    <ConfigItem title="表情包路径">
      <NInput v-model="emojiPath" />
    </ConfigItem>
    <ConfigItem title="最近发送过的表情包数量上限">
      <NInput v-model.number="recentEmojiCountLimit" />
    </ConfigItem>
  </ConfigList>

  <ConfigList title="杂项">
    <ConfigItem title="DevTools">
      <a href="https://nyaruhodoo.github.io/qwqnt-star-wand-devtools/" @click.prevent="openDevTools"
        >在线地址</a
      >
    </ConfigItem>
  </ConfigList>
</template>

<style scoped>
.reply-rules-wrapper {
  padding-top: 12px;
  padding-bottom: 12px;
}

.reply-rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.reply-rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px; /* 设置最大高度 */
  overflow-y: auto; /* 超出显示纵向滚动条 */
}

/* 优化自定义滚动条样式 */
.reply-rules-list::-webkit-scrollbar {
  width: 6px;
}

.reply-rules-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.reply-rules-list::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.reply-rule-card {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 12px;
  background-color: var(--bg-card, rgba(0, 0, 0, 0.02));
  transition: opacity 0.2s ease;
}

.reply-rule-card.disabled {
  opacity: 0.55;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--border-color, #eee);
}

.rule-index {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  cursor: pointer;
}

.btn {
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add {
  background-color: #409eff;
  color: white;
}

.btn-add:hover {
  background-color: #66b1ff;
}

.btn-delete {
  background-color: #f56c6c;
  color: white;
}

.btn-delete:hover {
  background-color: #f78989;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 16px 0;
  font-size: 13px;
}
</style>
