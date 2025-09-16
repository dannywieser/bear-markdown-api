import { FilterOptions, MarkdownNote } from '../../../types'

export const filterNotes = (allNotes: MarkdownNote[], filters: FilterOptions) =>
  allNotes.filter(
    (note) => matchByCreatedOrModified(note, filters) || matchByDateInText(note, filters)
  )

// Extracts all dates in supported formats from a string
export function extractDatesFromText(text: string): Date[] {
  // Regex for YYYY.MM.DD, YYYY-MM-DD, or YYYY/MM/DD
  const datePattern = /\b(\d{4})[.\-/](\d{2})[.\-/](\d{2})\b/g
  const matches = [...text.matchAll(datePattern)]
  return matches.map(([, year, month, day]) => new Date(`${year}-${month}-${day}`))
}

export function matchByCreatedOrModified(note: MarkdownNote, filters: FilterOptions) {
  const { d, m, y } = filters
  const dates = [note.created, note.modified].map((date) => new Date(date))
  return dates.some((date) => {
    if (y && date.getFullYear() !== y) return false
    if (m && date.getMonth() + 1 !== m) return false
    if (d && date.getDate() !== d) return false
    return true
  })
}

export function matchByDateInText(note: MarkdownNote, filters: FilterOptions) {
  const { d, m, y } = filters
  const text = typeof note.text === 'string' ? note.text : ''
  const dates = extractDatesFromText(text)
  return dates.some((date) => {
    if (y && date.getFullYear() !== y) return false
    if (m && date.getMonth() + 1 !== m) return false
    if (d && date.getDate() !== d) return false
    return true
  })
}
