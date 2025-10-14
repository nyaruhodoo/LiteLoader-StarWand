export interface NodeQQNTWrapperUtil {
  new (...args: unknown[]): Record<string, unknown>
  getNTUserDataInfoConfig: () => string
  emptyWorkingSet: (p1: number) => void
  pathIsReadableAndWriteable: 0 | 1
}
