import { Utils } from "src/utils";
import https from "https";

export interface RkeyServerResponse {
  private_rkey: string;
  group_rkey: string;
  expired_time: number;
  updated_time: string;
}

export class RkeyImage {
  // 世上好人还是多
  SERVER_URL = "https://llob.linyuchen.net/rkey";
  IMAGE_HTTP_HOST_NT = "https://multimedia.nt.qq.com.cn";
  IMAGE_HTTP_HOST = "https://gchat.qpic.cn";
  rkeyData = {
    group_rkey: "",
    private_rkey: "",
    expired_time: 0,
  };

  async getRkey() {
    if (this.isExpired()) {
      try {
        this.rkeyData = await this.fetchServerRkey();
      } catch (e) {
        Utils.log("获取rkey失败", e);
      }
    }
    return this.rkeyData;
  }

  async getNewImgUrl(originImageUrl: string) {
    const parsedUrl = new URL(this.IMAGE_HTTP_HOST_NT + originImageUrl);
    const imageAppid = parsedUrl.searchParams.get("appid");
    const isNewPic = imageAppid && ["1406", "1407"].includes(imageAppid);

    if (isNewPic) {
      const rkey = parsedUrl.searchParams.get("rkey");
      if (rkey) {
        return this.IMAGE_HTTP_HOST_NT + originImageUrl;
      }
      const rkeyData = await this.getRkey();

      return (
        this.IMAGE_HTTP_HOST_NT +
        originImageUrl +
        rkeyData[imageAppid === "1406" ? "private_rkey" : "group_rkey"]
      );
    } else {
      // 老的图片url，不需要rkey
      return this.IMAGE_HTTP_HOST + originImageUrl;
    }
  }

  isExpired() {
    const now = new Date().getTime() / 1000;
    return now > this.rkeyData.expired_time;
  }

  async fetchServerRkey(): Promise<RkeyServerResponse> {
    return new Promise((resolve, reject) => {
      const req = https.get(
        this.SERVER_URL,
        {
          agent: false,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "*/*",
          },
          timeout: 5000, // 设置 5 秒超时
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data) as RkeyServerResponse);
            } catch {
              reject(new Error(`解析 rkey 响应 JSON 失败: ${data.slice(0, 100)}`));
            }
          });
        },
      );

      req.on("error", (err) => {
        reject(err);
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("请求 rkey 超时"));
      });

      req.end();
    });
  }
}
