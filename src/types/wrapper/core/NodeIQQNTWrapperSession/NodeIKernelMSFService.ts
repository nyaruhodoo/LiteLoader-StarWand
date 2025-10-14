export interface NodeIKernelMSFService {
  online: () => void // 或者返回具体类型
  offline: () => void // 或者返回具体类型
  getServerTime: () => string
  getMsfStatus: () => number
  getNetworkProxy: () => string // 假设返回网络代理为字符串
  getBrowserAndSetLocalProxy: () => void // 假设没有返回值
  setNetworkProxy: (proxy: string) => void // 设置网络代理
  setNetworkProxySaveDir: (dir: string) => void // 设置代理保存目录
  testNetworkProxyConnection: () => Promise<boolean> // 假设返回一个 Promise，表示测试结果
}
