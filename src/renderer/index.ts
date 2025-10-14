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
    summoningStar(magicBox)

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

function cteateStar(size: string, color: string) {
  // 创建SVG元素的函数
  function createSVGElement(tag: string, attributes: Record<string, string>) {
    // 必须使用SVG命名空间
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag)

    // 设置所有属性
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value)
    }

    return element
  }

  const svg = createSVGElement('svg', {
    't': '1760455963016',
    'class': 'icon',
    'viewBox': '0 0 1024 1024',
    'version': '1.1',
    'xmlns': 'http://www.w3.org/2000/svg',
    'p-id': '15770',
    'width': size,
    'height': size,
  })

  // 创建path元素
  const path = createSVGElement('path', {
    'd': 'M565.228999 34.689634l112.062243 237.506364c8.702621 18.317097 25.411973 31.05108 44.816898 33.994614l250.736267 38.073966c48.688285 7.406826 68.213191 70.036902 32.930782 105.95921L824.307945 635.130487c-13.997782 14.237744-20.348775 34.810484-17.053298 54.927296l42.809217 261.086627c8.342678 50.687968-42.633244 89.441827-86.210339 65.50962l-224.276461-123.252469a57.030963 57.030963 0 0 0-55.271241 0l-224.276461 123.260467c-43.577095 23.91621-94.553017-14.82965-86.20234-65.509619l42.809216-261.094626c3.319474-20.116812-3.095509-40.697551-17.085293-54.927296L18.147691 450.223788C-17.126719 414.30148 2.326198 351.671404 51.070474 344.264578l250.704273-38.073966c19.348934-2.943534 36.074284-15.677516 44.752908-33.994614L458.63789 34.689634c21.820542-46.152687 84.826558-46.152687 106.58311 0z',
    'p-id': '15771',
  })

  path.setAttribute('fill', color)

  // 将path添加到SVG中
  svg.appendChild(path)

  svg.classList.add('star')

  return svg
}

function summoningStar(container: HTMLDivElement) {
  // 星星颜色数组
  const starColors = [
    '#FFB6C1', // 浅粉（温柔柔和，不刺眼）
    '#FFE4E1', // 雪粉（带白调，像樱花色）
    '#E0FFFF', // 浅蓝（清新感，像天空或薄荷）
    '#F0E68C', // 米黄（暖调浅色，比纯黄更柔和）
    '#98FB98', // 浅绿（嫩绿色，有生机感）
    '#DDA0DD', // 浅紫（淡薰衣草色，梦幻感）
    '#FFDAB9', // 浅橙（暖橘色，显活泼但不鲜艳）
  ]

  // 星星大小范围 (px)
  const starSizes = [12, 16, 20, 24]

  // 监听鼠标移动事件
  container.addEventListener('mousemove', (e) => {
    // 随机决定是否创建星星，控制星星密度
    if (Math.random() > 0.7)
      return

    // 随机选择颜色和大小
    const randomColor = starColors[Math.floor(Math.random() * starColors.length)]!
    const randomSize = starSizes[Math.floor(Math.random() * starSizes.length)]!

    // 创建星星元素
    const star = cteateStar(`${randomSize}`, randomColor)

    // 设置星星位置（稍微偏离鼠标位置）
    const offsetX = (Math.random() - 0.5) * 40
    const offsetY = (Math.random() - 0.5) * 40
    star.style.left = `${e.clientX + offsetX}px`
    star.style.top = `${e.clientY + offsetY}px`

    // 添加到页面
    container.append(star)

    // 动画结束后移除元素
    setTimeout(() => {
      star.remove()
    }, 1000)
  })
}

watchURLHash((hash) => {
  if (hash !== '#/main/message')
    return

  summoningMagic()
})

export { onSettingWindowCreated } from '@/renderer/configView'
