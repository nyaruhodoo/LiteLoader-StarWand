import { ipcMain } from 'electron'
import { WrapperEventEnum } from 'src/types/wrapper/eventEnum'
import { hookWrapper } from '@/main/hook/hookWrapper'
import { grabRedBag } from './grabRedBag'
import { msgInterceptors } from './hookMsg'
import { msgWithUrlInterceptors } from './hookMsgWithUrl'
import { videoFileEventInterceptors } from './hookVideoFile'

(async () => {
  const starWand = await hookWrapper({
    eventBlacklist: [WrapperEventEnum.sendLog, /tianshu/i],
    eventInterceptors: {
      ...msgWithUrlInterceptors,
      ...videoFileEventInterceptors,
      ...msgInterceptors,
    },
  })

  ipcMain.handle('starWand:session-invoke-method', async (_, { serviceFnPath, params = [] }: {
    serviceFnPath: string
    params: unknown[]
  }) => {
    if (!starWand.Session) {
      return {
        success: 1,
        error: 'starWand 未初始化',
      }
    }

    if (!serviceFnPath || typeof serviceFnPath !== 'string') {
      return {
        success: 1,
        error: 'serviceFnPath 必须是非空字符串',
      }
    }

    try {
      const fnPathArr = serviceFnPath.split('/').filter(Boolean)
      if (fnPathArr.length === 0) {
        throw new Error('serviceFnPath 路径格式错误')
      }

      let currentTarget: any = starWand.Session
      for (let i = 0; i < fnPathArr.length; i++) {
        const fnName = fnPathArr[i]

        if (!fnName)
          throw new Error('serviceFnPath 路径格式错误')

        // 检查当前层级是否存在该方法/属性
        if (!currentTarget || typeof currentTarget[fnName] !== 'function') {
          throw new Error(`路径层级 ${fnPathArr.slice(0, i + 1).join('/')} 不存在或不是函数`)
        }

        // 非最后一层：调用方法（无参数），作为下一层的目标
        if (i < fnPathArr.length - 1) {
          currentTarget = currentTarget[fnName]()
        }
        else {
          // 最后一层：调用方法并传入 params 参数
          currentTarget = currentTarget[fnName](...params)
        }
      }

      const result = await Promise.resolve(currentTarget)

      return {
        success: 0,
        data: result,
      }
    }
    catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误'
      console.error(`调用 ${serviceFnPath} 失败：`, errorMsg)
      return {
        success: 1,
        error: errorMsg,
      }
    }
  })

  grabRedBag()
})()
