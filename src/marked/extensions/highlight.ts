import { TokenizerExtension } from 'marked'

const getColor = (emoji: string = '🟡') => {
  switch (emoji) {
    case '🔴':
      return 'red'
    case '🔵':
      return 'blue'
    case '🟡':
      return 'yellow'
    case '🟢':
      return 'green'
    case '🟣':
      return 'purple'
    default:
      return 'yellow'
  }
}

const rule = /==([\p{Emoji}])([^\p{Emoji}=]+)==/u
export const start = (src: string) => src.indexOf('==')
export const tokenizer = (src: string) => {
  const match = rule.exec(src)
  if (match && match.index === 0) {
    return {
      color: getColor(match[1]),
      raw: match[0],
      text: match[2],
      type: 'highlight',
    }
  }
}

export const highlightExtension: TokenizerExtension = {
  level: 'inline',
  name: 'Bear Highlight',
  start,
  tokenizer,
}
