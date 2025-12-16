import { Utils } from 'src/utils'

export class RkeyImage {
  // 世上好人还是多
  SERVER_URL = 'https://llob.linyuchen.net/rkey'
  IMAGE_HTTP_HOST_NT = 'https://multimedia.nt.qq.com.cn'
  IMAGE_HTTP_HOST = 'https://gchat.qpic.cn'
  rkeyData = {
    group_rkey: '',
    private_rkey: '',
    expired_time: 0,
  }

  async getRkey() {
    if (this.isExpired()) {
      try {
        this.rkeyData = await this.fetchServerRkey()
      }
      catch (e) {
        Utils.log('获取rkey失败', e)
      }
    }
    return this.rkeyData
  }

  async getNewImgUrl(originImageUrl: string) {
    const parsedUrl = new URL(this.IMAGE_HTTP_HOST_NT + originImageUrl)
    const imageAppid = parsedUrl.searchParams.get('appid')
    const isNewPic = imageAppid && ['1406', '1407'].includes(imageAppid)

    if (isNewPic) {
      const rkey = parsedUrl.searchParams.get('rkey')
      if (rkey) {
        return this.IMAGE_HTTP_HOST_NT + originImageUrl
      }
      const rkeyData = await this.getRkey()

      return this.IMAGE_HTTP_HOST_NT + originImageUrl + rkeyData[imageAppid === '1406' ? 'private_rkey' : 'group_rkey']
    }
    else {
      // 老的图片url，不需要rkey
      return this.IMAGE_HTTP_HOST + originImageUrl
    }
  }

  isExpired() {
    const now = new Date().getTime() / 1000
    return now > this.rkeyData.expired_time
  }

  async fetchServerRkey() {
    const response = await fetch(this.SERVER_URL)

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return await response.json()
  }
}
