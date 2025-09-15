import { start, tokenizer } from './tag'

describe('start', () => {
  test.each([
    ['index of hashtag', 'foo #bar baz', 4],
    ['undefined if no hashtag', 'foo bar baz', undefined],
  ])('should return %s', (_desc, input, expected) => {
    expect(start(input)).toBe(expected)
  })
})

describe('tokenizer', () => {
  test.each([
    ['a hashtag', '#hello world', { raw: '#hello', text: 'hello', type: 'hashtag' }],

    [
      'multiple hashtags in one call (should only match first)',
      '#foo #bar',
      { raw: '#foo', text: 'foo', type: 'hashtag' },
    ],
    [
      'tags with forward slashes',
      '#foo/bar/baz',
      { raw: '#foo/bar/baz', text: 'foo/bar/baz', type: 'hashtag' },
    ],
    [
      'tags with dashes',
      '#foo-bar-baz',
      { raw: '#foo-bar-baz', text: 'foo-bar-baz', type: 'hashtag' },
    ],
  ])('should tokenize %s', (_desc, input, expected) => {
    const result = tokenizer(input)
    expect(result).toEqual(expected)
  })

  test.each([
    ['no hashtag', 'hello world'],
    ['hashtag with space after #', '# bar'],
    ['hashtag at end of string', 'foo #bar'], // this is undefined because marked will parse "foo" before invoking the tag extension
  ])('should return undefined for %s', (_desc, input) => {
    expect(tokenizer(input)).toBeUndefined()
  })
})
