const p = {
  test: !1
}, d = 4, g = "extension", f = "liteloader-napcatcore-template", a = "liteloader-napcatcore-template", m = "LiteLoaderQQNT的插件模板", y = "0.0.1", h = [
  {
    name: "Nyaruhodo",
    link: "https://github.com/nyaruhodoo"
  }
], w = [], C = [
  "win32",
  "linux",
  "darwin"
], v = {
  renderer: "./out/renderer/index.js",
  main: "./out/main/index.js",
  preload: "./out/preload/index.js"
}, u = {
  manifest_version: d,
  type: g,
  name: f,
  slug: a,
  description: m,
  version: y,
  authors: h,
  dependencies: w,
  platform: C,
  injects: v
};
class c {
  /**
   * 初始化插件配置
   */
  static async getConfig() {
    const n = await LiteLoader.api.config.get(u.slug, p);
    return this.mergeConfig(n, p);
  }
  /**
   * 更新插件配置
   */
  static async updateConfig(n) {
    await LiteLoader.api.config.set(u.slug, n), this.log("Config已更新", JSON.stringify(n));
  }
  /**
   * 合并配置项
   */
  static mergeConfig(n, t) {
    const e = structuredClone(t);
    for (const [i, o] of Object.entries(n))
      if (Object.hasOwn(e, i) && Object.prototype.toString.call(o) === Object.prototype.toString.call(e[i])) {
        if (Array.isArray(o)) {
          e[i] = [.../* @__PURE__ */ new Set([...o, ...e[i]])];
          continue;
        }
        if (typeof o == "object" && o) {
          e[i] = this.mergeConfig(o, e[i]);
          continue;
        }
        e[i] = o;
      }
    return e;
  }
  /**
   * 带有插件标识的Log
   */
  static log(...n) {
    console.log(`${u.slug}:`, ...n);
  }
  /**
   * 生成随机整数
   */
  static randomInteger(n, t) {
    const e = n + Math.random() * (t + 1 - n);
    return Math.floor(e);
  }
  /**
   * 返回一个指定时间后决议为 resolve 的 promise
   */
  static wait(n) {
    if (!(n <= 0))
      return new Promise((t) => setTimeout(t, n));
  }
  /**
   * 为对象创建深层Proxy
   */
  static createDeepProxy(n, t) {
    for (const e in n)
      typeof n[e] == "object" && n[e] && (n[e] = c.createDeepProxy(n[e], t));
    return new Proxy(n, t);
  }
  /**
   * 根据path从对象中取值
   */
  static getProperty(n, t) {
    let e = n;
    const i = t.split(".");
    for (; i.length; ) {
      const o = i.shift();
      if (!o) return;
      e = e[o];
    }
    return e;
  }
  /**
   * 根据path修改对象属性值
   */
  static setProperty(n, t, e) {
    let i = n;
    const o = t.split("."), r = o.pop();
    if (r) {
      for (; o.length; ) {
        const l = o.shift();
        if (!l) return;
        i = i[l];
      }
      return i[r] = e;
    }
  }
}
const x = (s) => [
  {
    title: "配置标题",
    foldTitle: "123",
    list: [
      {
        title: "配置项",
        type: "setting-switch",
        inputType: "text",
        keyPath: "test",
        value: s.test
      }
    ]
  }
], E = ({
  config: s,
  update: n
}) => {
  const t = document.createElement("input");
  return t.type = s.inputType ?? "text", t.value = s.value, t.addEventListener("change", () => {
    const e = s.customStoreFormat ? s.customStoreFormat(t.value) : t.value;
    n(s.keyPath, e);
  }), t;
}, b = ({
  config: s,
  update: n
}) => {
  const t = document.createElement(s.type);
  return s.value && t.setAttribute("is-active", "true"), t.addEventListener("click", function() {
    const e = t.hasAttribute("is-active");
    t.toggleAttribute("is-active"), n(s.keyPath, !e);
  }), t;
}, k = (s, n) => {
  const t = document.createElement("setting-item");
  t.setAttribute("data-direction", "row"), t.innerHTML = '<div class="setting-item-text"></div>';
  {
    const e = t.querySelector(".setting-item-text"), i = document.createElement("setting-text");
    if (i.innerHTML = s.title, e.append(i), s.description) {
      const o = document.createElement("setting-text");
      o.setAttribute("data-type", "secondary"), o.innerHTML = s.description, e.append(o);
    }
  }
  {
    let e;
    const i = c.setProperty.bind(null, n);
    switch (s.type) {
      case "setting-switch":
        e = b({
          config: s,
          update: i
        });
        break;
      case "input":
        e = E({
          config: s,
          update: i
        });
        break;
      default:
        return s.type;
    }
    t.append(e);
  }
  return t;
}, L = (s) => x(s).map(({ title: t, list: e, foldTitle: i }) => {
  const o = document.createElement("setting-section");
  t && o.setAttribute("data-title", t), o.innerHTML = `
      <setting-panel>
        <setting-list data-direction="column"></setting-list>
      </setting-panel>
    `;
  const r = o.querySelector("setting-list");
  i && (r?.setAttribute("is-collapsible", "true"), r?.setAttribute("data-title", i));
  for (const l of e)
    r?.append(k(l, s));
  return o;
}), S = "" + new URL("index.css", import.meta.url).href, A = window[a], P = async (s) => {
  const n = await c.getConfig(), t = c.createDeepProxy(n, {
    set(e, i, o) {
      e[i] = o;
      const r = JSON.parse(JSON.stringify(t));
      return c.updateConfig(r), s?.(r), !0;
    }
  });
  return t;
};
class T extends HTMLElement {
  async connectedCallback() {
    const n = this.attachShadow({ mode: "open" }), t = document.createElement("link");
    t.rel = "stylesheet", t.href = S, n.append(t);
    const e = await P((i) => {
      A.configUpdate(i), new BroadcastChannel(a).postMessage(i);
    });
    n.append(...L(e));
  }
}
customElements.define(a, T);
const M = (s) => {
  s.innerHTML = `<${a}></${a}>`;
};
export {
  M as onSettingWindowCreated
};
