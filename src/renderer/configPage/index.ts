import { slug } from '@/manifest'
import styleUrl from './index.scss?url'
import movileUrl from './movie.mp4?url'

class ConfigElement extends HTMLElement {
  async connectedCallback() {
    const liteloader = document.querySelector('.setting-main') as HTMLDivElement
    liteloader.style.backgroundColor = 'black'

    const shadow = this.attachShadow({ mode: 'open' })

    // CSS
    const linkEl = document.createElement('link')
    linkEl.rel = 'stylesheet'
    linkEl.href = styleUrl
    shadow.append(linkEl)

    const video = document.createElement('video')
    video.src = movileUrl
    video.loop = true
    video.volume = 0.05
    const p = document.createElement('p')
    p.innerHTML = `闇の力を秘めし键よ、真の姿を我の前に示せ、契约のもとさくらが命じる、レリーズ！`

    shadow.append(video, p)

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play()
          const liteloader = document.querySelector('.setting-main') as HTMLDivElement
          liteloader.style.backgroundColor = 'black'
        } else {
          video.pause()
          const liteloader = document.querySelector('.setting-main') as HTMLDivElement
          liteloader.style.backgroundColor = 'transparent'
        }
      })
    })
    observer.observe(video)
  }
}
customElements.define(slug, ConfigElement)

export const onSettingWindowCreated = (view: HTMLElement) => {
  view.innerHTML = `<${slug}></${slug}>`
}
