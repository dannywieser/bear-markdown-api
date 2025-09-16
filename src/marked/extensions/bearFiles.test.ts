import { makeBearFilesExtension } from './bearFiles'

describe('makeBearFilesExtension', () => {
  const files = [
    { directory: 'dir1', file: 'file1.png', path: '/files/file1.png' },
    { directory: 'dir2', file: 'file2.jpg', path: '/files/file2.jpg' },
  ]
  const extension = makeBearFilesExtension(files)
  const tokenizer = extension.tokenizer as unknown as (src: string) => unknown

  test.each([
    [
      'matches and rewrites href for known file',
      '[file1.png](file1.png)',
      {
        href: encodeURI('/files/file1.png'),
        raw: '[file1.png](file1.png)',
        type: 'link',
      },
    ],
    [
      'matches and rewrites href for known file with encoded name',
      '[file2.jpg](file2.jpg)',
      {
        href: encodeURI('/files/file2.jpg'),
        raw: '[file2.jpg](file2.jpg)',
        type: 'link',
      },
    ],
    [
      'matches and returns original href for a non-file link',
      '[google](www.google.com)',
      {
        href: 'www.google.com',
        raw: '[google](www.google.com)',
        type: 'link',
      },
    ],
  ])('tokenizer %s', (_desc, input, expected) => {
    const result = tokenizer(input)
    expect(result).toEqual(expected)
  })

  test('returns undefined for non-link input', () => {
    expect(tokenizer('no link here')).toBeUndefined()
  })

  test('returns undefined for incomplete link', () => {
    const result = tokenizer('[file1.png]file1.png)')

    expect(result).toBeUndefined()
  })
})
