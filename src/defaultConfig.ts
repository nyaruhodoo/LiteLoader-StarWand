export interface ConfigType {
  minimumAmount: number;
  randomDelay: {
    min: number;
    max: number;
  };
  redPackTextBlacklist: string;
  groupBlacklist: string;
  senderBlacklist: string;
  skipPwd: boolean;
  autoSendmsg: string;
  devPort: number;
  // 新增：群消息屏蔽配置
  messageBlock: {
    // 关键字黑名单（支持正则，&分割）
    keywordBlacklist: string;
    // 等级屏蔽
    levelBlock: string;
    // 屏蔽视频
    blockVideo: boolean;
    // 屏蔽图片
    blockImage: boolean;
    // 屏蔽表情包
    blockEmoji: boolean;
    // 屏蔽捏一捏
    blockPoke: boolean;
    // 屏蔽表情回应
    blockEmojiReply: boolean;
    // 屏蔽接龙
    blockSolitaire: boolean;
    // 屏蔽机器人消息
    blockRobot: boolean;
    // 白名单（&分割）
    whitelist: string;
  };

  // 新增：群消息监听配置
  messageMonitor: {
    // 监听关键字（支持正则，&分割）
    keyword: string;
    // 监听白名单（&分割）
    whitelist: string;
    // 特别关心列表（&分割）
    favoriteList: string;
  };

  emojiSendCount: Record<
    string,
    {
      /** 文件MD5值 */
      md5HexStr: string;
      /** 图片宽度 */
      picWidth: number;
      /** 图片高度 */
      picHeight: number;
      /** 文件名 */
      fileName: string;
      /** 文件大小（字符串格式数字） */
      fileSize: string;
      /** 是否为原图 */
      original: boolean;
      /** 图片子类型 */
      picSubType: number;
      /** 源文件本地路径 */
      sourcePath: string;
      /** 缩略图路径（可能为undefined） */
      thumbPath?: Map<number, string>;
      /** 图片主类型 */
      picType: number;
      /** 文件UUID（空字符串） */
      fileUuid: string;
      /** 文件子ID（空字符串） */
      fileSubId: string;
      /** 缩略图文件大小 */
      thumbFileSize: number;
      /** 摘要信息 */
      summary: string;
      /** 使用次数 */
      sendTime: number;
    }
  >;
  emojiPath: string;
  recentEmojiCountLimit: number;
}

export const defaultConfig: ConfigType = {
  minimumAmount: 200,
  randomDelay: {
    min: 2000,
    max: 4000,
  },
  redPackTextBlacklist: "挂&死&狗&测试",
  groupBlacklist: "",
  senderBlacklist: "",
  skipPwd: false,
  autoSendmsg: "谢谢",
  devPort: 3666,
  messageBlock: {
    keywordBlacklist: "",
    levelBlock: "",
    blockVideo: false,
    blockImage: false,
    blockEmoji: false,
    blockSolitaire: false,
    blockRobot: false,
    whitelist: "",
    blockPoke: false,
    blockEmojiReply: false,
  },
  messageMonitor: {
    keyword: "",
    whitelist: "",
    favoriteList: "",
  },
  emojiSendCount: {},
  emojiPath: "",
  recentEmojiCountLimit: 18,
};
