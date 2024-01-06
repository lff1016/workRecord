import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type {ContentType, DateItemType} from '../index.d'


export const formatDay2String  = (date: Dayjs, format = 'YYYY-MM-DD') => {
  if(!date) return ''
  return date.format(format)
}

export const formatString2Day = (dateString: string) => {
  return dayjs(dateString)
}

export function cloneDeep(obj) {
  if (typeof obj !== 'object') return obj

  const newObj = obj instanceof Array ? [] : {}

  for (const key in obj) {
    newObj[key] = typeof obj[key] === 'object' ? cloneDeep(obj[key]) : obj[key]
  }
  return newObj
}