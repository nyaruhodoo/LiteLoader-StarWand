export interface NodeQQNTWrapperUtil {
  new (...args: unknown[]): Record<string, unknown>
  pathIsReadableAndWriteable: (path: string, p2: 1) => 0 | 1
  createThumbnailImage: (
    typr: 'flashtransfer',
    path1: string,
    path2: string,
    p3: {
      width: number
      height: number
    },
    p4: 'jpeg' | 'png',
  ) => WrapperAsyncResponse
}
