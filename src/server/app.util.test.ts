import { Request } from 'express'

import { parseQuery } from './app.util'

describe('parseQuery', () => {
  test.each([
    [
      'parses a valid text param',
      { query: { text: 'meeting' } },
      { d: undefined, m: undefined, text: 'meeting', y: undefined },
    ],
    [
      'returns undefined for missing text param',
      { query: {} },
      { d: undefined, m: undefined, text: undefined, y: undefined },
    ],
    [
      'returns undefined for non-string text param',
      { query: { text: 123 } },
      { d: undefined, m: undefined, text: undefined, y: undefined },
    ],
    [
      'parses text with other params',
      { query: { d: '2', text: 'foo', y: '2020' } },
      { d: 2, m: undefined, text: 'foo', y: 2020 },
    ],
    [
      'parses valid numeric query params',
      { query: { d: '15', m: '9', y: '2025' } },
      { d: 15, m: 9, text: undefined, y: 2025 },
    ],
    [
      'returns undefined for missing params',
      { query: {} },
      { d: undefined, m: undefined, text: undefined, y: undefined },
    ],
    [
      'returns undefined for non-numeric params',
      { query: { d: 'foo', m: 'bar', y: 'baz' } },
      { d: undefined, m: undefined, text: undefined, y: undefined },
    ],
    [
      'parses a mix of valid and invalid params',
      { query: { d: '1', m: 'nope', y: '2020' } },
      { d: 1, m: undefined, text: undefined, y: 2020 },
    ],
    [
      'text param is forced to lowercase',
      { query: { text: 'TEXT PARAM VALUE' } },
      { text: 'text param value' },
    ],
  ])('%s', (_desc, req, expected) => {
    expect(parseQuery(req as unknown as Request)).toEqual(expected)
  })
})
