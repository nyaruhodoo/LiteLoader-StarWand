import { WrapperInterceptors } from "@/types/wrapper/core";

export const picInterceptors: WrapperInterceptors = {
  "NodeIQQNTWrapperSession/getNTWrapperSession/getMsgService/getHotPicHotWords:response":
    async () => {
      return {
        result: 0,
        errMsg: "",
        rsp: {
          resultCode: 0,
          errorMsg: "suc",
          traceId: "",
          size: 8,
          items: [
            { word: "哈哈哈", searchNum: 0, itemType: 0 },
            { word: "在吗", searchNum: 0, itemType: 0 },
            { word: "宝贝", searchNum: 0, itemType: 0 },
            { word: "拜拜", searchNum: 0, itemType: 0 },
            { word: "为什么", searchNum: 0, itemType: 0 },
            { word: "我不知道", searchNum: 0, itemType: 0 },
            { word: "笑死我了", searchNum: 0, itemType: 0 },
            { word: "爱你", searchNum: 0, itemType: 0 },
          ],
        },
      };
    },
};
