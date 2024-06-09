/* eslint-disable @typescript-eslint/no-explicit-any */
export function removeNullFields<T>(data: T | T[]): T | T[] {
  if (Array.isArray(data)) {
    return data.map((item) => removeNullFields(item)) as T[]
  } else if (typeof data === 'object' && data !== null) {
    const result: any = {}
    for (const key in data) {
      if (data[key] !== null) {
        result[key] = removeNullFields(data[key])
      }
    }
    return result as T
  } else {
    return data
  }
}
