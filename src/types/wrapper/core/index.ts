import type { NodeIKernelLoginService } from './NodeIKernelLoginService'
import type { NodeIO3MiscService } from './NodeIO3MiscService'
import type { NodeIOPSafePwdEdit } from './NodeIOPSafePwdEdit'
import type { NodeIQQNTWrapperEngine } from './NodeIQQNTWrapperEngine'
import type { NodeIQQNTWrapperSession } from './NodeIQQNTWrapperSession'
import type { NodeQQNTWrapperUtil } from './NodeQQNTWrapperUtil'
import type { DeepPath, ResolvePath } from '@/types/utils'

/**
 * 只有 NodeIQQNTWrapperSession 是调用的 create 其他均是 get
 */
type WrapperApiWithMethods<
  T = unknown,
  IncludeMethods extends ('get' | 'create')[] = ['get'],
> = {
  new (...args: unknown[]): T
} & {
  [K in IncludeMethods[number]]?: () => T;
}

type FilterListener<T extends string> = T extends `${string}Listener/${string}`
  ? T
  : never

export interface Wrapper {
  NodeIQQNTWrapperEngine: WrapperApiWithMethods<NodeIQQNTWrapperEngine>
  NodeIKernelLoginService: WrapperApiWithMethods<NodeIKernelLoginService>
  NodeIOPSafePwdEdit: WrapperApiWithMethods<NodeIOPSafePwdEdit>
  NodeIQQNTWrapperSession: {
    getNTWrapperSession: NodeIQQNTWrapperSession
  }
  NodeIO3MiscService: WrapperApiWithMethods<NodeIO3MiscService>
  NodeQQNTWrapperUtil: NodeQQNTWrapperUtil
}
export type WrapperPaths = DeepPath<Wrapper>
export type WrapperResponsePaths = `${WrapperPaths}:response`
export type WrapperResolvePath<T extends string> = T extends WrapperPaths
  ? ResolvePath<Wrapper, T>
  : never
export type ListenerPaths = FilterListener<WrapperPaths>

// 监听器会包含调用参数以及响应结果
export type WrapperEventMap = {
  [K in WrapperPaths]: [
    {
      applyRet: Awaited<ReturnType<WrapperResolvePath<K>>>
      params: Parameters<WrapperResolvePath<K>>
    },
  ];
}
// 拦截器可以拦截调用前或调用后
type WrapperAllPaths = WrapperPaths | WrapperResponsePaths
type getParams<T extends WrapperAllPaths> = T extends `${infer Name}:response`
  ? {
      applyRet: ReturnType<WrapperResolvePath<Name>>
      params: Parameters<WrapperResolvePath<Name>>
    }
  : Parameters<WrapperResolvePath<T>>
type getReturn<T extends WrapperAllPaths> = T extends `${infer Name}:response`
  ? ReturnType<WrapperResolvePath<Name>>
  : Parameters<WrapperResolvePath<T>>
export type WrapperInterceptors = {
  [K in WrapperAllPaths]?: (params: getParams<K>) => getReturn<K> | void;
}
