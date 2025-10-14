import './index.css'

const magicCssUrl = new URL('./index.css', import.meta.url).href
const css = document.createElement('link')
css.rel = 'stylesheet'
css.href = magicCssUrl
document.head.append(css)

function watchURLHash(callback: (hash: string) => unknown) {
  if (!location.hash.includes('#/blank')) {
    callback(location.hash)
  }
  else {
    // @ts-expect-error  忽略错误
    navigation.addEventListener('navigatesuccess', () => {
      callback(location.hash)
    }, { once: true })
  }
}

function summoningMagic() {
  setTimeout(() => {
    const globalContainer = document.querySelector('.global-container') as (HTMLDivElement | null)
    const weather = document.querySelector('.user-profile-card__widgets .user-profile-card__weather')
    const container = document.querySelector('.container-content') as (HTMLDivElement | null)
    if (!container || !globalContainer)
      return

    container.style.transition = 'transform 0.3s ease'
    globalContainer.style.transition = 'background 0.3s ease'

    // 好了，该让你见识见识真正的魔法了
    const magicBox = document.createElement('div')
    magicBox.className = 'magic-box'

    const video = document.createElement('video')
    video.src = 'https://cdn-img.gitcode.com/db/ee/61dbe40308efe583abf419907ee78dc784d4910531c49f0fa5a2090196be41b0.mp4?response-content-type=video/mp4'
    video.loop = true
    video.volume = 0.05

    const spell = document.createElement('p')
    spell.className = 'spell'
    spell.innerHTML = `星の力を秘めしかぎよ、真の姿を我の前に示せ、けいやくのもとさくらが命じる、レリーズ！`

    magicBox.append(video)
    magicBox.append(spell)
    globalContainer.append(magicBox)
    let cacheBackground: string | undefined

    weather?.addEventListener('click', (e) => {
      e.stopPropagation()

      // 加了皮肤后竟然是单独的容器....
      const miracleBackground = document.querySelector('.miracle-background') as HTMLDivElement | null
      miracleBackground && (miracleBackground.style.transition = 'background 0.3s ease')

      if (container.style.transform.includes('translateY(100%)')) {
        container.style.transform = 'none'
        magicBox.style.zIndex = '-1'
        magicBox.style.opacity = '0'
        video.pause()

        // BUG: 如果施展魔法后又主动切换主题就会有点问题，不修了
        if (miracleBackground) {
          miracleBackground.style.background = cacheBackground ?? ''
        }
      }
      else {
        container.style.transform = 'translateY(100%)'
        setTimeout(() => {
          video.play()
          magicBox.style.zIndex = '1'
          magicBox.style.opacity = '1'
        }, 200)

        if (miracleBackground) {
          cacheBackground = miracleBackground.style.background
          miracleBackground.style.background = '#000'
        }
      }

      if (globalContainer.style.background !== '') {
        globalContainer.style.background = ''
      }
      else {
        globalContainer.style.setProperty('background', '#000', 'important')
      }
    }, {
      capture: true,
    })

    weather?.addEventListener('mouseenter', (e) => {
      e.stopPropagation()
    }, {
      capture: true,
    })
  }, 200)
}

watchURLHash((hash) => {
  if (hash !== '#/main/message')
    return

  summoningMagic()
})

export { onSettingWindowCreated } from '@/renderer/configView'
