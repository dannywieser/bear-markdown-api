import { marked } from 'marked'

import { MarkdownNote } from '../types'
import { highlightExtension, tagExtension } from './extensions'
import { makeBearImagesExtension } from './extensions/bearImages'
import { makeWikilinkExtension } from './extensions/wikilink'

export function lexer(note: MarkdownNote, allNotes: MarkdownNote[]) {
  const { files = [], text = '' } = note
  const wikilinksExtension = makeWikilinkExtension(allNotes)
  const bearImagesExtension = makeBearImagesExtension(files)
  marked.use({
    extensions: [bearImagesExtension, highlightExtension, tagExtension, wikilinksExtension],
  })
  return marked.lexer(text)
}
