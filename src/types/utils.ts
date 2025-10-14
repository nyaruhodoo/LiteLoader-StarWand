type JoinPath<
  Prefix extends string,
  Key extends string | number,
> = `${Prefix}${Prefix extends '' ? '' : '/'}${Key extends string ? Key : ''}`

// 特殊处理wrapper中的部分拼接逻辑
type ReturnTypeOrSelf<T, K extends string = ''> = K extends `${infer _}Service` | 'get' | 'create'
  ? T extends (...args: any[]) => infer R
    ? R
    : T
  : K extends `${infer _}Listener`
    ? T extends (...args: [infer P]) => any
      ? P
      : never
    : T

// 用于递增深度的元组类型
type IncrementDepth<T extends any[]> = [...T, any]
// 便于从 wrapper 路径中排除无意义的组合
type Filter<T extends string> = T extends `${infer _}/${string}`
  ? T extends `${string}${'Service' | 'get' | 'create' | 'Listener'}`
    ? never
    : T
  : never
// 用于取出路径中的第0项
type SplitPath<Path extends string> = Path extends `${infer Head}/${infer Tail}` ? [Head, Tail] : [Path, '']

/**
 * 深度遍历对象类型(其实只针对于Wrapper)
 * @template T - 目标对象类型
 * @template Prefix - 当前路径前缀，默认为 ''
 */
export type DeepPath<
  T,
  Prefix extends string = '',
  Depth extends any[] = [],
  MaxDepth extends number = 10,
> = Depth['length'] extends MaxDepth
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string
          ? | Filter<JoinPath<Prefix, K>>
          | DeepPath<ReturnTypeOrSelf<T[K], K>, JoinPath<Prefix, K>, IncrementDepth<Depth>, MaxDepth>
          : never
      }[keyof T]
    : never

/**
 * 反向操作，从 path 里解析出对应的类型，其实本来准备直接解析出一个对象方便取值的，但是没写好 /(ㄒoㄒ)/~~
 * @template T - 目标对象类型
 * @template Prefix - 当前路径前缀，默认为 ''
 */
export type ResolvePath<T, Path extends string> = Path extends ''
  ? T
  : SplitPath<Path> extends [infer Head extends string, infer Tail extends string]
    ? ResolvePath<Exclude<ReturnTypeOrSelf<T[Head & keyof T], Head>, undefined>, Tail>
    : never
