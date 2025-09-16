import { Request } from 'express'

import { FilterOptions } from '../types'

export const parseQuery = (req: Request): FilterOptions => {
  const { d, m, y } = req.query

  return {
    d: d ? Number(d) : undefined,
    m: m ? Number(m) : undefined,
    y: y ? Number(y) : undefined,
  }
}
