import { webContents, ipcMain } from "electron";

// 提取全局 fetch 的第二个参数类型 (即 options 的类型)
type FetchOptions = NonNullable<Parameters<typeof fetch>[1]>;

/**
 * 触发远程请求并获取结果
 */
export function requestInRenderer(url: string, options: FetchOptions) {
  return new Promise((resolve, reject) => {
    const replyChannel = `fetch-reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 监听返回（只接收第一个响应窗口的结果，之后自动销毁）
    ipcMain.once(replyChannel, (_, response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.error));
      }
    });

    // 广播给所有渲染进程
    webContents.getAllWebContents().forEach((contents) => {
      if (!contents.isDestroyed() && contents.getType() === "window") {
        contents.send("do-fetch-request", { url, options, replyChannel });
      }
    });
  });
}
