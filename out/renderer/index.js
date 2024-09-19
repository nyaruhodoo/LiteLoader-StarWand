const t = "liteloader-star-wand", m = "" + new URL("index.css", import.meta.url).href, u = "" + new URL("font.css", import.meta.url).href;
class p extends HTMLElement {
  async connectedCallback() {
    const a = document.querySelector(".setting-main");
    a.style.backgroundColor = "black";
    const n = document.createElement("link");
    n.rel = "stylesheet", n.href = u, document.head.append(n);
    const l = this.attachShadow({ mode: "open" }), o = document.createElement("link");
    o.rel = "stylesheet", o.href = m, l.append(o);
    const e = document.createElement("video");
    e.src = `${LiteLoader.plugins[t].path.plugin}\\assets\\movie.mp4`, e.loop = !0, e.volume = 0.05;
    const c = document.createElement("p");
    c.innerHTML = "星の力を秘めしかぎよ、真の姿を我の前に示せ、けいやくのもとさくらが命じる、レリーズ！", l.append(e, c), new IntersectionObserver((i) => {
      i.forEach((d) => {
        if (d.isIntersecting) {
          e.play();
          const s = document.querySelector(".setting-main");
          s.style.backgroundColor = "black";
        } else {
          e.pause();
          const s = document.querySelector(".setting-main");
          s.style.backgroundColor = "transparent";
        }
      });
    }).observe(e);
  }
}
customElements.define(t, p);
const g = (r) => {
  r.innerHTML = `<${t}></${t}>`;
};
export {
  g as onSettingWindowCreated
};
