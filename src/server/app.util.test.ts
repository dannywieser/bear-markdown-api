import { Request } from 'express'

import { parseQuery } from './app.util'

describe('parseQuery', () => {
  it('parses valid numeric query params', () => {
    const req = { query: { d: '15', m: '9', y: '2025' } } as unknown as Request
    expect(parseQuery(req)).toEqual({ d: 15, m: 9, y: 2025 })
  })

  it('returns undefined for missing params', () => {
    const req = { query: {} } as unknown as Request
    expect(parseQuery(req)).toEqual({ d: undefined, m: undefined, y: undefined })
  })

  it('returns undefined for non-numeric params', () => {
    const req = { query: { d: 'foo', m: 'bar', y: 'baz' } } as unknown as Request
    expect(parseQuery(req)).toEqual({ d: undefined, m: undefined, y: undefined })
  })

  it('parses a mix of valid and invalid params', () => {
    const req = { query: { d: '1', m: 'nope', y: '2020' } } as unknown as Request
    expect(parseQuery(req)).toEqual({ d: 1, m: undefined, y: 2020 })
  })
})
