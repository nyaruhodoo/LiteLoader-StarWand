export interface hookWarpperConfigType {
  // 是否打印日志
  log?: boolean
  // 需要忽略的黑名单事件
  eventBlacklist?: (string | RegExp)[]
  // 拦截事件，可以修改参数
  eventInterceptors?: Record<string, (eventData: any) => any>
}
export interface hookIPCConfigType {
  log?: 'all' | 'send' | 'message'
  // 需要忽略的黑名单事件
  eventBlacklist?: string[]
  // 拦截事件，可以修改参数
  eventInterceptors?: Record<string, (eventData: any) => any>
}

type SendRequestType<T = any> = [
  string,
  {
    type: 'request'
    eventName: string
  },
  [
    {
      cmdName: string
      cmdType: string
      payload: T
    }
  ]
]
type SendResponseType<T = any> = [
  string,
  {
    callbackId: string
    promiseStatue: 'full' | 'fail'
    type: 'response'
    eventName: string
  },
  T
]

export type SendArgsType = SendRequestType | SendResponseType

type IPCMessageRequestType<T = [...any]> = [
  {
    frameId: number
    processId: number
  },
  boolean,
  string,
  [
    {
      type: 'request'
      callbackId: string
      eventName: string
    },
    [string?, ...T]
  ]
]
type IPCMessageResponseType<T = any> = [
  IPCMessageRequestType[0],
  IPCMessageRequestType[1],
  IPCMessageRequestType[2],
  [SendResponseType[1], T]
]

export type IPCMessageArgsType = IPCMessageRequestType | IPCMessageResponseType
