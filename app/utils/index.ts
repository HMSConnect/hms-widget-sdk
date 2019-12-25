import * as _ from 'lodash'
import qs from 'qs'

export function toNaturalName(s: string) {
  return _.chain(s)
    .words()
    .map(v => _.capitalize(v))
    .join(' ')
    .value()
}

export function parse(s: string) {
  const decoded = qs.parse(s)
  // qs -> option decode not work, use JSON.parse instead.

  return JSON.parse(JSON.stringify(decoded), (key: any, value: any) => {
    if (/^(\d+|\d*\.\d+)$/.test(value)) {
      return Number(value)
    }
    return value
  })
}
