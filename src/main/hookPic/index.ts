import { WrapperInterceptors } from "@/types/wrapper/core";
import fs from "fs/promises";
import { join } from "path";
import crypto from "crypto";
import { WrapperEventEnum } from "@/types/wrapper/eventEnum";
import { starWand } from "../hook/hookWrapper";
import { Utils } from "src/utils";
import { accessSync } from "fs";
import { ipcMain } from "electron";
import { ConfigType } from "src/defaultConfig";
import { slug } from "@/manifest";

let config = Utils.getConfig("main");
ipcMain.on(`${slug}:update`, (_, updateConfig: ConfigType) => {
  config = updateConfig;
});

let folderNames: string[] = [];

const getPicList = async (userText?: string) => {
  const searchText = userText ?? folderNames[0];

  if (!searchText) return;

  // 拼接目标文件夹路径
  const targetFolderPath = join(config.emojiPath, searchText);

  // 读取该文件夹下所有文件（只一层）
  const files = await fs.readdir(targetFolderPath);

  // 筛选出常见图片格式（可自行增删）
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
  const imagePaths = files
    .filter((file) => imageExts.some((ext) => file.toLowerCase().endsWith(ext)))
    .map((file) => join(targetFolderPath, file)); // 转成完整路径

  const ret = imagePaths.map((path) => {
    // 随便写个已有的

    const md5 = crypto.createHash("md5").update(path).digest("hex");
    // 你提供的固定 URL 模板（直接用你的值）
    const imageUrl = ``;
    const thumbnailUrl = ``;
    // 返回和你示例完全一样的结构
    return {
      resourceID: md5,
      imageMD5: md5,
      imageWidth: 240, // 固定值即可
      imageHeight: 240, // 固定值即可
      imageUrl: imageUrl,
      imageSize: "10240",
      thumbnailMD5: md5,
      thumbnailWidth: 240,
      thumbnailHeight: 240,
      thumbnailUrl: thumbnailUrl,
      thumbnailSize: "10240",
      imageOther: "",
      packageID: "5",
      packageType: "",
      srcWebUrl: "",
      srcIconUrl: "",
      srcName: "",
      emojiType: 0,
      textComposeInfo: null,
      mallEmojiInfo: null,
      path: path,
      isExist: true,
    };
  });

  return {
    result: 0,
    errMsg: "",
    rsp: {
      resultCode: 0,
      errorMsg: "成功",
      other: "",
      pageHasNext: false,
      composeEmojis: [],
      allowCompose: false,
      sessionInfo: new Uint8Array(0),
      infoArray: ret,
    },
  };
};

starWand.wrapperEmitter.addListener(WrapperEventEnum.sendMsg, async ({ params }) => {
  const elements = params[2];

  for (const element of elements) {
    if (
      element.picElement &&
      (element.picElement.picSubType === 13 || element.picElement?.picSubType === 2)
    ) {
      const picInfo = element.picElement;
      const customEmoji = config.emojiSendCount[picInfo.md5HexStr];
      if (customEmoji) {
        customEmoji.sendTime = Date.now();
      } else {
        // 新增记录
        config.emojiSendCount[picInfo.md5HexStr] = {
          ...picInfo,
          sendTime: Date.now(),
        };
      }
    }
  }

  const emojiEntries = Object.entries(config.emojiSendCount);
  const top16Emojis = emojiEntries.slice(0, config.recentEmojiCountLimit);
  config.emojiSendCount = Object.fromEntries(top16Emojis);

  Utils.updateConfig(config, "main");
});

export const picInterceptors: WrapperInterceptors = {
  // 无视默认表情包，主要用于加快搜索速度，无其他作用
  "NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getHotPicInfoListSearchString": (
    params,
  ) => {
    params[2] = 0;
  },

  /**
   * 无视默认搜索时的表情包数量限制，主要用于加快搜索速度，无其他作用
   */
  "NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getHotPicSearchResult": (params) => {
    if (!folderNames.includes(params[0].userText)) return params;

    params[0].pageSize = 0;
  },

  /**
   * 返回最近发送的表情包
   */
  "NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getHotPicInfoListSearchString:response":
    async ({ params }) => {
      const hotPicInfos = Object.values(config.emojiSendCount)
        .filter((emoji) => {
          try {
            accessSync(emoji.sourcePath, fs.constants.F_OK);
            return true;
          } catch {
            return false;
          }
        })
        .sort((a, b) => b.sendTime - a.sendTime)
        .map((emoji) => ({
          picId: emoji.md5HexStr,
          // 移除后四位
          fileMd5: emoji.md5HexStr.slice(0, -4),
          fileType: 3,
          fileSize: emoji.fileSize,
          fileWidth: emoji.picWidth,
          fileHeight: emoji.picHeight,
          downloadUrl: `https://wa.qq.com/hot-res/5a47ad46b268598cba3b4ffe462a8e65-t.gif`,
          thumbMd5: emoji.md5HexStr.slice(0, -4),
          thumbFileSize: emoji.thumbFileSize + "",
          thumbFileWidth: emoji.picWidth,
          thumbFileHeight: emoji.picHeight,
          thumbDownloadUrl: `https://wa.qq.com/hot-res/5a47ad46b268598cba3b4ffe462a8e65-t.gif`,
          picIndex: 0,
          sourceType: 2,
          thirdPartyInfo: {
            appId: "",
            iconUrl: "",
            name: "",
            jumpUrl: "",
          },
          path: emoji.sourcePath,
          isExist: true,
        }));

      const picId = params[1];
      if (picId === hotPicInfos[hotPicInfos.length - 1]?.picId) {
        return {
          result: -5,
          errMsg: "no more info",
          hotPicInfos: [],
        };
      }

      return {
        result: 0,
        errMsg: "",
        hotPicInfos,
      };
    },

  /**
   * 返回自定义表情包列表
   */
  "NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getHotPicHotWords:response":
    async () => {
      try {
        // 读取目录下所有条目
        const entries = await fs.readdir(config.emojiPath, { withFileTypes: true });
        // 筛选出【文件夹】并提取名称
        folderNames = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
      } catch (err) {
        console.error("读取表情包目录失败：", err);
      }

      return {
        result: 0,
        errMsg: "",
        rsp: {
          resultCode: 0,
          errorMsg: "suc",
          traceId: "",
          size: folderNames.length,
          items: folderNames.map((word) => ({
            word,
            searchNum: 0,
            itemType: 0,
          })),
        },
      };
    },

  /**
   * 根据搜索词返回表情包列表
   */
  "NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getHotPicSearchResult:response":
    async ({ applyRet, params }) => {
      if (!folderNames.includes(params[0].userText)) return applyRet;

      try {
        const res = await getPicList(params[0].userText);
        if (res) return res;
        return applyRet;
      } catch (err) {
        console.error("读取表情包图片失败：", err);
        return applyRet;
      }
    },
};
