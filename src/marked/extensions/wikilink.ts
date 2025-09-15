import { TokenizerExtension } from 'marked'

import { MarkdownNote } from '../../types'

export function makeWikilinkExtension(noteCache: MarkdownNote[]): TokenizerExtension {
  const rule = /\[\[(.+?)\]\]/u
  const start = (src: string) => (src.indexOf('[[') > -1 ? src.indexOf('[[') : undefined)
  const tokenizer = (src: string) => {
    const match = rule.exec(src)
    if (match && match.index === 0) {
      const linkTitle = match[1]
      const targetNote = noteCache.find(({ title: noteTitle }) => linkTitle === noteTitle)
      const href = targetNote ? targetNote.noteUrl : 'invalid'
      return {
        href,
        raw: match[0],
        text: match[1],
        type: 'wikilink',
      }
    }
  }

  return {
    level: 'inline',
    name: 'wikilink',
    start,
    tokenizer,
  }
}
