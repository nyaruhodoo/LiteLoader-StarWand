export interface ConfigType {
	minimumAmount: number
	randomDelay: {
		min: number
		max: number
	}
	redPackTextBlacklist: string
	groupBlacklist: string
	senderBlacklist: string
	skipPwd: boolean
	autoSendmsg: string
	devPort: number
	// 新增：群消息屏蔽配置
	messageBlock: {
		// 关键字黑名单（支持正则，&分割）
		keywordBlacklist: string
		// 等级屏蔽
		levelBlock: string
		// 屏蔽视频
		blockVideo: boolean
		// 屏蔽图片
		blockImage: boolean
		// 屏蔽表情包
		blockEmoji: boolean
		// 屏蔽捏一捏
		blockPoke: boolean
		// 屏蔽表情回应
		blockEmojiReply: boolean
		// 屏蔽接龙
		blockSolitaire: boolean
		// 屏蔽机器人消息
		blockRobot: boolean
		// 白名单（&分割）
		whitelist: string
	}

	// 新增：群消息监听配置
	messageMonitor: {
		// 监听关键字（支持正则，&分割）
		keyword: string
		// 监听白名单（&分割）
		whitelist: string
		// 特别关心列表（&分割）
		favoriteList: string
	}
}

export const defaultConfig: ConfigType = {
	minimumAmount: 200,
	randomDelay: {
		min: 2000,
		max: 4000,
	},
	redPackTextBlacklist: '挂&死&狗&测试',
	groupBlacklist: '',
	senderBlacklist: '',
	skipPwd: false,
	autoSendmsg: '谢谢',
	devPort: 3666,
	messageBlock: {
		keywordBlacklist: '',
		levelBlock: '',
		blockVideo: false,
		blockImage: false,
		blockEmoji: false,
		blockSolitaire: false,
		blockRobot: false,
		whitelist: '',
		blockPoke: false,
		blockEmojiReply: false,
	},
	messageMonitor: {
		keyword: '',
		whitelist: '',
		favoriteList: '',
	},
}
