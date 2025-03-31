import { slug } from '@/manifest'
import styleUrl from './index.scss?url'
import fontUrl from './font.scss?url'

class ConfigElement extends HTMLElement {
  async connectedCallback() {
    const liteloader = document.querySelector('.setting-main') as HTMLDivElement
    liteloader.style.backgroundColor = 'black'

    // font
    const fontEl = document.createElement('link')
    fontEl.rel = 'stylesheet'
    fontEl.href = fontUrl
    document.head.append(fontEl)

    const shadow = this.attachShadow({ mode: 'open' })

    // CSS
    const linkEl = document.createElement('link')
    linkEl.rel = 'stylesheet'
    linkEl.href = styleUrl
    shadow.append(linkEl)

    linkEl.addEventListener('load', () => {
      const video = document.createElement('video')
      video.src =
        'https://cdn-img.gitcode.com/db/ee/61dbe40308efe583abf419907ee78dc784d4910531c49f0fa5a2090196be41b0.mp4?response-content-type=video/mp4'
      video.loop = true
      video.volume = 0.05
      const p = document.createElement('p')
      p.innerHTML = `星の力を秘めしかぎよ、真の姿を我の前に示せ、けいやくのもとさくらが命じる、レリーズ！`

      shadow.append(video, p)

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play()
            const liteloader = document.querySelector('.setting-main') as HTMLDivElement
            liteloader.style.backgroundColor = 'black'
            const titlebar = document.querySelector('.setting-title') as HTMLDivElement
            titlebar.style.visibility = 'hidden'
          } else {
            video.pause()
            const liteloader = document.querySelector('.setting-main') as HTMLDivElement
            liteloader.style.removeProperty('background-color')
            const titlebar = document.querySelector('.setting-title') as HTMLDivElement
            titlebar.style.removeProperty('visibility')
          }
        })
      })
      observer.observe(video)
    })
  }
}
customElements.define(slug, ConfigElement)

export const onSettingWindowCreated = (view: HTMLElement) => {
  view.innerHTML = `<${slug}></${slug}>`
}
