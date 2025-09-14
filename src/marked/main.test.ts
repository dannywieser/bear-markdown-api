import { marked } from 'marked'

import { mockMarkdownNote } from '../testing-support'
import { highlightExtension, tagExtension } from './extensions'
import { makeBearImagesExtension } from './extensions/bearImages'
import { makeWikilinkExtension } from './extensions/wikilink'
import { lexer } from './main'

jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))

jest.mock('./extensions/bearImages', () => ({
  makeBearImagesExtension: jest.fn().mockReturnValue({ name: 'bearImage' }),
}))
jest.mock('./extensions/highlight', () => ({
  highlightExtension: { name: 'highlight' },
}))
jest.mock('./extensions/tag', () => ({
  tagExtension: { name: 'tag' },
}))
jest.mock('./extensions/wikilink', () => ({
  makeWikilinkExtension: jest.fn().mockReturnValue({ name: 'wikilink' }),
}))

const notes = [mockMarkdownNote({ id: 'a' }), mockMarkdownNote({ id: 'b' })]

describe('lexer', () => {
  test('calls marked.use with highlight, tag, and wikilink extensions', () => {
    const note = mockMarkdownNote()

    lexer(note, notes)

    expect(makeWikilinkExtension).toHaveBeenCalledWith(notes)
    expect(makeBearImagesExtension).toHaveBeenCalledWith([])
    expect(marked.use).toHaveBeenCalledWith({
      extensions: [{ name: 'bearImage' }, highlightExtension, tagExtension, { name: 'wikilink' }],
    })
  })

  test('returns tokens from marked.lexer', () => {
    const note = mockMarkdownNote()

    const result = lexer(note, notes)

    expect(marked.lexer).toHaveBeenCalledWith(note.text)
    expect(result).toEqual(['token1', 'token2'])
  })
})
