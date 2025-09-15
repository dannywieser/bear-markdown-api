import { TokenizerExtension } from 'marked'

import { MarkdownNoteFile } from '../../types'

export function makeBearFilesExtension(files: MarkdownNoteFile[]): TokenizerExtension {
  const rule = /^\[(.*?)\]\((.*?)\)/u
  const tokenizer = (src: string) => {
    const match = rule.exec(src)
    if (match) {
      const linkedFile = match[1] ? decodeURIComponent(match[1]) : ''
      const targetFile = files.find(({ file }) => file === linkedFile)
      const href = targetFile ? encodeURI(targetFile.path) : match[2]
      return {
        href,
        raw: match[0],
        type: 'link',
      }
    }
  }

  return {
    level: 'inline',
    name: 'link',
    tokenizer,
  }
}
