import { randPastDate } from '@ngneat/falso'
import dayjs from 'dayjs'

export function datetime() {
  return dayjs(randPastDate()).format('YYYY-MM-DD HH:mm:ss')
}

export function timeStamp() {
  return dayjs(randPastDate()).valueOf()
}

export function unixTimestamp() {
  return dayjs(randPastDate()).unix()
}
