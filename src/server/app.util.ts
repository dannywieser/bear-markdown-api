import { Request } from 'express'

import { FilterOptions } from '../types'

export const parseQuery = (req: Request): FilterOptions => {
  const { d, m, text: textParam, y } = req.query

  const parseNum = (val: unknown) => {
    const num = Number(val)
    return typeof val === 'undefined' || val === '' || isNaN(num) ? undefined : num
  }

  return {
    d: parseNum(d),
    m: parseNum(m),
    text: typeof textParam === 'string' ? textParam : undefined,
    y: parseNum(y),
  }
}
