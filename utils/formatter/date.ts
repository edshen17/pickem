import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export function formatDate(
  dt: Dayjs | Date | string | null | undefined,
  formatString = `MM/DD/YY`,
  replacer = ``,
) {
  return dt ? dayjs(dt).format(formatString) : replacer
}
