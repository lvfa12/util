
/**
 * 使之后的代码延时执行
 * @param time 延时时间
 */
export const delay = (time: number = 500): Promise<any> => new Promise(rev => setTimeout(rev, time));