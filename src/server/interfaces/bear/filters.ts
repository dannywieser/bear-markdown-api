import { FilterOptions, MarkdownNote } from '../../../types'

export const filterNotes = (allNotes: MarkdownNote[], filters: FilterOptions) =>
  allNotes.filter(
    (note) => matchByCreatedOrModified(note, filters) || matchByDateInText(note, filters)
  )

const matchPartialDate = (dates: Date[], { d, m, y }: FilterOptions) =>
  dates.some((date) => {
    if (y && date.getFullYear() !== y) return false
    if (m && date.getMonth() + 1 !== m) return false
    if (d && date.getDate() !== d) return false
    return true
  })

// Extracts all dates in supported formats from a string
export function extractDatesFromText(text: string): Date[] {
  // Regex for YYYY.MM.DD, YYYY-MM-DD, or YYYY/MM/DD
  const datePattern = /\b(\d{4})[.\-/](\d{2})[.\-/](\d{2})\b/g
  const matches = [...text.matchAll(datePattern)]
  return matches.map(
    ([, year, month, day]) => new Date(Number(year), Number(month) - 1, Number(day))
  )
}

export function matchByCreatedOrModified(note: MarkdownNote, filters: FilterOptions) {
  const dates = [note.created, note.modified].map((date) => {
    const d = new Date(date)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  })
  console.log(dates)
  return matchPartialDate(dates, filters)
}

export function matchByDateInText(note: MarkdownNote, filters: FilterOptions) {
  const text = typeof note.text === 'string' ? note.text : ''
  const dates = extractDatesFromText(text)
  return matchPartialDate(dates, filters)
}
