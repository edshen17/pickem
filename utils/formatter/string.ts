import { startCase, toLower } from 'lodash'

export function toTitleCase(v: string) {
  return startCase(toLower(v))
}
