import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';


export const formatDay2String  = (date: Dayjs, format = 'YYYY-MM-DD') => {
  if(!date) return ''
  return date.format(format)
}

export const formatString2Day = (dateString: string) => {
  return dayjs(dateString)
}