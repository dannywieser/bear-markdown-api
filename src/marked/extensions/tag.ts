import { TokenizerExtension } from 'marked'

const rule = /#([^\s#]+)/
export const start = (src: string) => (src.indexOf('#') > -1 ? src.indexOf('#') : undefined)
export const tokenizer = (src: string) => {
  const match = rule.exec(src)
  if (match && match.index === 0) {
    return {
      raw: match[0],
      text: match[1],
      type: 'hashtag',
    }
  }
}

export const tagExtension: TokenizerExtension = {
  level: 'inline',
  name: 'hashtag',
  start,
  tokenizer,
}
