import { Request } from 'express'

import { FilterOptions } from '../types'

const parseNum = (val: unknown) => {
  const num = Number(val)
  return typeof val === 'undefined' || val === '' || isNaN(num) ? undefined : num
}

const parseString = (val: unknown) => (typeof val === 'string' ? val.toLowerCase() : undefined)

const parseTags = (val: unknown): string[] | undefined =>
  typeof val === 'string'
    ? [val]
    : Array.isArray(val) && val.every((t) => typeof t === 'string')
      ? val
      : undefined

export const parseQuery = (req: Request): FilterOptions => {
  const { d, m, tag: tagParam, text: textParam, y } = req.query
  return {
    d: parseNum(d),
    m: parseNum(m),
    tag: parseTags(tagParam),
    text: parseString(textParam),
    y: parseNum(y),
  }
}
