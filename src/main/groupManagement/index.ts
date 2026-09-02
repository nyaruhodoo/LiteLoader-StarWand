import { WrapperEventEnum } from "@/types/wrapper/eventEnum";
import { ChatType } from "@/types/wrapper/core/NodeIQQNTWrapperSession/Element";
import { access } from "fs/promises";

import { Utils } from "src/utils";

import { ipcMain } from "electron";
import { ConfigType } from "src/defaultConfig";
import { slug } from "@/manifest";

import { starWand } from "../hook/hookWrapper";

// 回复冷却缓存 Map：Key 为 `群号:回复内容`，Value 为上一次发送的时间戳(ms)
const replyCooldownMap = new Map<string, number>();
const COOLDOWN_TIME = 60 * 1000; // 1 分钟冷却时间 (60,000 ms)

/**
 * 发送带 @ 的文本消息
 */
function sendMsg(params: {
  chatType: ChatType;
  peerUid: string;
  atUid: string;
  atNtUid: string;
  reply: string;
  sendMemberName: string;
}) {
  starWand.Session?.getMsgService().sendMsg(
    "",
    {
      chatType: params.chatType,
      peerUid: params.peerUid,
      guildId: "",
    },
    [
      {
        elementType: 1,
        elementId: "",
        // @ts-expect-error  忽略错误
        textElement: {
          content: `@${params.sendMemberName}`,
          atType: 2,
          atUid: params.atUid,
          atTinyId: "",
          atNtUid: params.atNtUid,
        },
      },
      {
        elementType: 1,
        elementId: "",
        textElement: {
          content: " " + params.reply,
          atType: 0,
          atUid: "",
          atTinyId: "",
          atNtUid: "",
          subElementType: 0,
          atChannelId: "",
          linkInfo: null,
          atRoleId: "",
          atRoleColor: 0,
          atRoleName: "",
          needNotify: 0,
        },
      },
    ],
    new Map(),
  );
}

/**
 * 检查文件是否存在
 */
async function isFileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

let config = Utils.getConfig("main");

export function initGroupManagement() {
  ipcMain.on(`${slug}:update`, (_, updateConfig: ConfigType) => {
    config = updateConfig;
  });

  /**
   * 自助回复
   */
  starWand.wrapperEmitter.addListener(WrapperEventEnum.onRecvMsg, async ({ params }) => {
    const msgInfo = params[0][0];
    if (!msgInfo || msgInfo.chatType !== 2) return;

    const { chatType, senderUid, peerUid, elements, senderUin, sendMemberName, msgId } = msgInfo;

    // 不处理机器人消息
    const botAttr = msgInfo.msgAttrs.get(22) as Record<string, unknown>;
    if (botAttr && botAttr.botMetaData) return;

    /**
     * 指定群组开启
     */
    const groupList = config.keywordAutoReplyGroupList
      .split("&")
      .map((item) => item.trim())
      .filter(Boolean);
    if (groupList.length === 0 || !groupList.includes(peerUid)) return;

    /**
     * 获取文本消息，并统一转为小写
     */
    let msgText = elements
      .filter((i) => i.textElement)
      .filter((i) => i.textElement?.atType !== 2)
      .map((i) => i.textElement?.content || "")
      .join("")
      .toLowerCase();

    /**
     * 额外添加图片OCR识别的文本（如果有的话）
     */
    if (config.enableOCR) {
      await (async () => {
        try {
          const picElementList = elements.filter((i) => i.picElement);
          const imgUrl = picElementList[0]?.picElement?.originImageUrl;
          if (!imgUrl) return;

          const sourcePath = picElementList[0]?.picElement?.sourcePath;

          if (!sourcePath) return;

          const exists = await isFileExists(sourcePath);
          if (!exists) {
            console.log("本地文件不存在，开始下载图片...");
            starWand.Session?.getMsgService().downloadRichMedia({
              fileModelId: "0",
              downSourceType: 0,
              triggerType: 1,
              msgId,
              chatType,
              peerUid,
              elementId: picElementList[0]?.elementId || "",
              thumbSize: 0,
              downloadType: 2,
              filePath: sourcePath,
            });
            await Utils.wait(2000);
            console.log("图片下载完成，保存路径：", sourcePath);
          } else {
            console.log("本地文件已存在，无需下载：", sourcePath);
          }

          const ocrResult = await starWand.Session?.getNodeMiscService().wantWinScreenOCR(
            sourcePath.replace(/\\/g, "/"),
          );

          if (ocrResult?.result?.length) {
            const ocrText = ocrResult.result
              .map((item) => item.text || "")
              .join("")
              .toLowerCase(); // OCR 文本同样转为小写

            msgText += ocrText;
          }
        } catch (err) {
          console.warn("图片 OCR 处理失败，已跳过图片文本识别:", err);
        }
      })();
    }

    /**
     * 自助回复
     */
    const now = Date.now();

    for (const rule of config.keywordAutoReplyList) {
      if (!rule.enable || !rule.keyword || !rule.reply) continue;

      // 使用 & 分隔关键词，去除空格并统一转为小写
      const keywords = rule.keyword
        .split("&")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

      // 检查是否有任意一个关键词匹配转换后的文本
      const hasMatch = keywords.some((word) => msgText.includes(word));

      if (hasMatch) {
        // 使用 [群号:回复内容] 作为缓存 Key，实现单群对特定回复内容的独立冷却
        const cooldownKey = `${peerUid}:${rule.reply}`;
        const lastSentTime = replyCooldownMap.get(cooldownKey) || 0;

        // 如果距离上一次回复时间小于 1 分钟，直接跳过
        if (now - lastSentTime < COOLDOWN_TIME) {
          console.log(`冷却中，跳过回复: ${rule.reply} (群号: ${peerUid})`);
          continue;
        }

        // 更新冷却时间
        replyCooldownMap.set(cooldownKey, now);

        sendMsg({
          chatType,
          peerUid,
          atUid: senderUin,
          atNtUid: senderUid,
          reply: rule.reply,
          sendMemberName,
        });

        return;
      }
    }
  });
}
