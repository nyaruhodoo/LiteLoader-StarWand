import packageJson from "@/package";
import { onSettingWindowCreated } from "./configView";
import { Utils } from "./utils";
import "./index.css";

// 假设使用的对象挂在 window 下，按实际注入对象选择 (如 window.ipcImpl 或 window.ipcRenderer)
const ipc = (window as any).ipcImpl || (window as any).ipcRenderer;

/**
 * init
 */
Utils.watchURLHash((hash) => {
  if (hash !== "#/main/message") return;

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = Utils.createStorageUrl("/dist/renderer/index.css");
  document.head.append(css);

  ipc.on("do-fetch-request", async (_event: any, { url, options, replyChannel }: any) => {
    try {
      const res = await fetch(url, options);
      const data = await res.json();

      ipc.send(replyChannel, { success: true, data });
    } catch (error: any) {
      ipc.send(replyChannel, {
        success: false,
        error: error?.message || "Fetch Error",
      });
    }
  });
});

/**
 * Plugin Settings
 */
RendererEvents.onSettingsWindowCreated(async () => {
  const view = await PluginSettings.renderer.registerPluginSettings(packageJson);
  onSettingWindowCreated(view);
});
