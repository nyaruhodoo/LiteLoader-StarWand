const o = "liteloader-star-wand", u = "" + new URL("index.css", import.meta.url).href, p = "" + new URL("font.css", import.meta.url).href;
class b extends HTMLElement {
  async connectedCallback() {
    const d = document.querySelector(".setting-main");
    d.style.backgroundColor = "black";
    const n = document.createElement("link");
    n.rel = "stylesheet", n.href = p, document.head.append(n);
    const l = this.attachShadow({ mode: "open" }), t = document.createElement("link");
    t.rel = "stylesheet", t.href = u, l.append(t), t.addEventListener("load", () => {
      const e = document.createElement("video");
      e.src = "https://cdn-img.gitcode.com/db/ee/61dbe40308efe583abf419907ee78dc784d4910531c49f0fa5a2090196be41b0.mp4?response-content-type=video/mp4", e.loop = !0, e.volume = 0.05;
      const s = document.createElement("p");
      s.innerHTML = "星の力を秘めしかぎよ、真の姿を我の前に示せ、けいやくのもとさくらが命じる、レリーズ！", l.append(e, s), new IntersectionObserver((a) => {
        a.forEach((m) => {
          if (m.isIntersecting) {
            e.play();
            const c = document.querySelector(".setting-main");
            c.style.backgroundColor = "black";
            const i = document.querySelector(".setting-title");
            i.style.visibility = "hidden";
          } else
            e.pause(), document.querySelector(".setting-main").style.removeProperty("background-color"), document.querySelector(".setting-title").style.removeProperty("visibility");
        });
      }).observe(e);
    });
  }
}
customElements.define(o, b);
const f = (r) => {
  r.innerHTML = `<${o}></${o}>`;
};
export {
  f as onSettingWindowCreated
};
