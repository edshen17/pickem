import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export function formatDate(
  dt: Dayjs | Date | string | null | undefined,
  formatString = `M/DD/YYYY`,
  replacer = ``,
) {
  return dt ? dayjs(dt).format(formatString) : replacer
}
