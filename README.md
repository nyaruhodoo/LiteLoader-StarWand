# 写在最前

测试版本 **9.9.15-27597**

由于 26909 版本后 wrapper 有很大改动，导致该模板并不能同时支持之前版本  
并且由于 NapCatCore 已被入土，在使用时难免会遇到一些不如意的问题  
~~参数错误、类型错误~~

不过你也不用太过担心，实际上本项目与 NapCatCore 并不具备什么依赖性  
~~我经常在想为什么这个项目要叫做 NapCatCore-Template~~  
引入它的目的只是为了有个好心人帮我们整理 API 以及相关参数，让我举个小栗子

```ts
// 如果 NTcore 中有这个API，那么你就可开心的直接调用
const { result, errMsg } = await NTcore.ApiMsg.xxx()

// 如果你想用的API不存在，你也可以直接引用 session 自行处理，自己做好类型支持就是了
const { result, errMsg } = await NTcore.session.xxx

// NTcore 并不是必须的，只是因为我没有 export session ....
```

# LiteLoader-NapCatCore-Template

自用插件开发模板，会尽可能实现开发插件时所需要的基础功能，使开发者焦距核心功能

当前提供的功能如下

- 快速创建插件配置页面
- 提供 Hook Wrapper / Hook IPC (侵入性那是相当强，从头 hook 到脚)

## 待办事项

- [ ] 修复 watch 打包
- [ ] 支持更多组件用于丰富配置选项
- [ ] 支持账号独立配置文件
- [ ] 使用其他构建工具替换 Vite，目前所用的这一套还是太笨重了，在很多地方都存在不少问题
- [ ] 集成插件自更新功能

~~仓库是早上建的，坑是晚上弃的~~

## 使用教程？文档？胡言乱语？

### Hook Wrapper

可以先了解下 [NapCatCore](https://github.com/NapNeko/LiteLoader-NapCatCore)  
该模板并不只是单纯的创建了 `NTCore` 实例，而是对 Wrapper 中的函数都进行了拦截用于做到更多事情  
~~如果你不喜欢可以参考 [NapCatExample](https://github.com/NapNeko/LiteLoader-NapCatExample) 使用非侵入式的方式创建 NTCore，我不觉得会有很大区别就是了~~

```ts
interface hookWarpperConfigType {
  // 是否打印日志
  log?: boolean
  // 需要忽略的黑名单事件
  eventBlacklist?: string[]
  // 拦截事件，可以修改参数
  eventInterceptors?: Record<string, (eventData: any) => any>
}
```

当你使用 `wrapperEmitter` 或 `eventInterceptors` 时，需要确认好事件名  
我默认屏蔽了 2 个事件，结合 log 我想你很快知道如何使用  
 ~~其实就是把函数的调用全拼接到一起~~

另一个注意的点是 NapCatCore 中的大多数 API 都需要登陆后调用，所以 await 会去等待登录后才执行

```ts
;(async () => {
  await hookWrapper()
  // 一些乱七八糟的初始化，如果你有依赖 NTCore 的话
})()
```

### Hook IPC

提供的参数和 wrapper 类似，都可以做到对某个事件的中断以及参数修改

```ts
// 参数
interface hookIPCConfigType {
  log?: 'all' | 'send' | 'message'
  eventBlacklist?: string[]
  eventInterceptors?: Record<string, (args: any) => any>
}
```

`eventInterceptors` 和 `ipcEmitter` 中的事件名你同样可以通过开启 `log` 来查看  
`cmdName` 和 `eventName` 均可  
需要注意的是当你拦截 `response` 时事件名需要写 `${eventName}:response`

关于 IPC 多写点好了，本来这些内容应该放到新手教程那边，但我实在是不想维护不同项目了  
众所周知 IPC 是可以双向通信的，也就是主线程和渲染线程的通信，再举个栗子

```ts
// 此处为渲染线程向主线程 emit 的消息
;[
  { frameId: 1, processId: 5 },
  false,
  // 这里的2，代表的是qq主窗口，每个窗口都具备自己的标识ID
  'IPC_UP_2',
  [
    {
      // request 代表请求主线程去做某件事
      type: 'request',
      // 该id用于主线程向渲染线程发送消息时进行订阅调用结果
      callbackId: '57ee753d-e390-46d0-b785-abff293786d4',
      // 该参数搭配下面的 checkHasMultipleQQ 会形成一个函数的调用
      eventName: 'ns-BusinessApi-2'
    },
    ['checkHasMultipleQQ']
  ]
]
```

```ts
// 此处为主线程向渲染线程 send 的消息
;[
  'IPC_DOWN_2',
  {
    callbackId: '57ee753d-e390-46d0-b785-abff293786d4',
    promiseStatue: 'full',
    type: 'response',
    eventName: 'ns-BusinessApi-2'
  },
  // 只需关注这里即可，代表的是返回值
  true
]
// 主线程除了会发送 response 也会发送 request 类型事件
;[
  ('IPC_DOWN_2',
  { type: 'request', eventName: 'ns-ntApi-2' },
  [
    {
      // 收到新消息时情况则会反过来，是主线程请求渲染线程去做某些事，会派发一个 cmd 事件
      cmdName: 'nodeIKernelGroupListener/onGroupNotifiesUnreadCountUpdated',
      cmdType: 'event',
      // 携带参数
      payload: []
    }
  ])
]
```

具体的细节就不再过多描述，你可以直接去阅读代码

`Hook IPC` 与 `Hook Wrapper` 可以共存，但因提供的功能比较类似还是只推荐使用其一

### 修改 manifest & defaultConfig & createConfigViewConfig

没什么好说的，你总得有自己的插件名字和插件配置不是？  
需要注意的是 `manifest.json` 中的 `slug` 属性，代码中依赖了该属性，对于命名也有一些要求，需要符合 `customElements.define()` 的参数

### 实时更新配置文件

虽然代码保证了你在配置页面修改配置时同步本地文件，但你的插件如何及时同步则需要你自己进行处理  
配置文件更新后会向主线程使用 `send` 派发 `${slug}:update` 事件，向渲染层使用 [BC](https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel) 派发 `${slug}` 频道事件

```ts
// 主线程
ipcMain.on(`${slug}:update`, (_, config) => {
  // 初始化你的插件逻辑
})

// 渲染层
const bc = new BroadcastChannel(slug)
bc.addEventListener('message', (event) => {
  // 初始化你的插件逻辑
})
```

### 新旧配置合并策略

在调用 `Utils.getConfig` 时，会基于当前 `defaultConfig` 与用户的本地配置进行一次深度合并

```ts
static mergeConfig(oldConfig: Record<string, any>, newConfig: ConfigType) {
    const targetObj = structuredClone(newConfig)

    for (const [key, value] of Object.entries(oldConfig)) {
      // 废弃的属性
      if (!Object.hasOwn(targetObj, key)) continue
      // 类型已更新
      if (Object.prototype.toString.call(value) !== Object.prototype.toString.call(targetObj[key])) continue
      // 合并数组
      if (Array.isArray(value)) {
        targetObj[key] = [...new Set([...value, ...targetObj[key]])]
        continue
      }
      // 处理对象类型，进行深层合并
      if (typeof value === 'object' && value) {
        targetObj[key] = this.mergeConfig(value, targetObj[key])
        continue
      }
      // 基本值以本地配置为准
      targetObj[key] = value
    }

    return targetObj
  }
```

## 构建相关

因基于 electron-vite 进行构建，所以功能大差不差，只是做了略微修改  
main、preload、renderer 3个文件都是独立打包不会存在共同引用，但不妨碍你在开发时引用共同的代码，在打包后会分别复制到3个文件中

**node_modules 中的文件也会跟随打包，目的是为了它人使用插件时不需要在安装依赖**  
**唯一的注意事项是不要在渲染层引用 node 环境下的依赖**

### 类型

- 全局注入了 `global.d.ts` 暴露 `LiteLoader` 相关API (类型可能有误)
- 增加了 `contextBridge.d.ts` 用于在 `preload` 与 `renderer` 之间暴露接口时同步类型

### 路径

- 增加了常用的 `@` 来引用 `src` 目录
- 增加了 `@/manifest` 来引用 `manifest.json` 文件

### 引用静态资源

```ts
import styleUrl from './index.scss?url'

const linkEl = document.createElement('link')
linkEl.rel = 'stylesheet'
linkEl.href = styleUrl
shadow.append(linkEl)
```

这些功能都是 `vite` 提供的，你也可以使用 `raw`、`base64` 等格式
