import packageJson from "@/package";
import { onSettingWindowCreated } from "./configView";
import { Utils } from "./utils";
import "./index.css";

/**
 * init
 */
Utils.watchURLHash((hash) => {
  if (hash !== "#/main/message") return;

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = Utils.createStorageUrl("/dist/renderer/index.css");
  document.head.append(css);
});

/**
 * Plugin Settings
 */
RendererEvents.onSettingsWindowCreated(async () => {
  const view = await PluginSettings.renderer.registerPluginSettings(packageJson);
  onSettingWindowCreated(view);
});
