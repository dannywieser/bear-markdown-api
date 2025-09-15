import { MarkdownNote } from '../../types'
import { makeWikilinkExtension } from './wikilink'

const allNotes = [
  { id: 'abc123', noteUrl: '/path/to/abc123', title: 'NoteOne' },
  { id: 'def456', noteUrl: '/path/to/def456', title: 'Note-Two' },
  { id: 'ghi789', title: 'Note/Three' },
] as unknown as MarkdownNote[]

describe('wikilink extension', () => {
  const extension = makeWikilinkExtension(allNotes)
  // The typing for TokenizerExtension is quite picky so I'm just ignoring for the scope of testing.
  const start = extension.start as unknown as (src: string) => number
  const tokenizer = extension.tokenizer as unknown as (src: string) => unknown

  test('start returns index of wikilink', () => {
    expect(start('foo [[NoteOne]] bar')).toBe(4)
    expect(start('no wikilink here')).toBeUndefined()
  })

  test('returns undefined for wikilink that is not at the start of the string', () => {
    expect(tokenizer('some other text and then a [[WikiLink]]')).toBeUndefined()
  })

  test('tokenizer returns token for a valid wikilink', () => {
    const src = '[[Note-Two]]'
    const token = tokenizer(src)
    expect(token).toMatchObject({
      href: '/path/to/def456',
      raw: '[[Note-Two]]',
      text: 'Note-Two',
      type: 'wikilink',
    })
  })

  test('tokenizer returns undefined for non-wikilink', () => {
    expect(tokenizer('no link')).toBeUndefined()
  })

  test('tokenizer works with slashes and dashes in title', () => {
    expect(tokenizer('[[Note/Three]]')).toMatchObject({
      raw: '[[Note/Three]]',
      text: 'Note/Three',
      type: 'wikilink',
    })
  })

  test('sets href as invalid if note not found', () => {
    expect(tokenizer('[[Missing Note]]')).toMatchObject({
      href: 'invalid',
      raw: '[[Missing Note]]',
      text: 'Missing Note',
      type: 'wikilink',
    })
  })
})
