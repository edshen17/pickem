import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export function isDateBefore(startDate: Dayjs | Date | null | string, endDate: Dayjs | Date | null | string = dayjs()) {
  return dayjs(startDate).isBefore(endDate)
}

export function isDateBeforeToday(startDate: Dayjs | Date | null | string) {
  return isDateBefore(startDate)
}

export function isDateAfter(startDate: Dayjs | Date | null | string, endDate: Dayjs | Date | null | string = dayjs()) {
  return dayjs(startDate).isAfter(endDate)
}

export function isDateAfterToday(startDate: Dayjs | Date | null | string) {
  return isDateAfter(startDate)
}
