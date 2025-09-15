import { start, tokenizer } from './highlight'

describe('highlight tokenizer', () => {
  test.each([
    [
      'yellow highlight by default',
      '==🟡highlighted text==',
      {
        color: 'yellow',
        raw: '==🟡highlighted text==',
        text: 'highlighted text',
        type: 'highlight',
      },
    ],
    [
      'red highlight',
      '==🔴important==',
      { color: 'red', raw: '==🔴important==', text: 'important', type: 'highlight' },
    ],
    [
      'blue highlight',
      '==🔵note==',
      { color: 'blue', raw: '==🔵note==', text: 'note', type: 'highlight' },
    ],
    [
      'green highlight',
      '==🟢success==',
      { color: 'green', raw: '==🟢success==', text: 'success', type: 'highlight' },
    ],
    [
      'purple highlight',
      '==🟣tip==',
      { color: 'purple', raw: '==🟣tip==', text: 'tip', type: 'highlight' },
    ],
    [
      'default to yellow for unknown emoji',
      '==💩oops==',
      { color: 'yellow', raw: '==💩oops==', text: 'oops', type: 'highlight' },
    ],
  ])('tokenize %s', (_desc, src, expected) => {
    const result = tokenizer(src)

    expect(result).toEqual(expected)
  })

  test.each([
    ['non-highlighted text', 'no highlight here'],
    ['incomplete highlight syntax', '==🟡missing end'],
  ])('should return undefined for %s', (_desc, src) => {
    const result = tokenizer(src)

    expect(result).toBeUndefined()
  })

  describe('highlight start', () => {
    test.each([
      ['valid highlight', 'Some text ==🟡highlight== more text', 10],
      ['no highlight', 'No highlight here', -1],
      ['incomplete highlight', '==🟡missing end', 0],
    ])('returns %s', (_desc, src, expected) => {
      const index = start(src)

      expect(index).toBe(expected)
    })
  })
})
