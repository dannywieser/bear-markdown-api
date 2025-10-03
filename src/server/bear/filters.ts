import { FilterFunction, FilterOptions, MarkdownNote } from '../../types'

export const filterNotes = (allNotes: MarkdownNote[], filters: FilterOptions) => {
  const { d, m, tag, text, y } = filters
  const dateFilters = y || m || d
  const filterFunctions: FilterFunction[] = [
    ...(dateFilters ? [matchByCreatedOrModified, matchByDateInText] : []),
    ...(text ? [matchByTextInNote] : []),
    ...(tag ? [matchByTagInNote] : []),
  ]
  if (filterFunctions.length === 0) return allNotes
  return allNotes.filter((note) => filterFunctions.some((fn) => fn(note, filters)))
}

const parseNoteText = (note: MarkdownNote) =>
  typeof note.text === 'string' ? note.text.toLowerCase() : ''

const matchPartialDate = (dates: Date[], { d, m, y }: FilterOptions) =>
  dates.some((date) => {
    if (y && date.getFullYear() !== y) return false
    if (m && date.getMonth() + 1 !== m) return false
    if (d && date.getDate() !== d) return false
    return true
  })

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
  return matchPartialDate(dates, filters)
}

export const matchByDateInText = (note: MarkdownNote, filters: FilterOptions) =>
  matchPartialDate(extractDatesFromText(parseNoteText(note)), filters)

export const matchByTextInNote = (
  note: MarkdownNote,
  { text: searchText = '' }: FilterOptions
): boolean => parseNoteText(note).includes(searchText)

export const matchByTagInNote: FilterFunction = ({ tags }: MarkdownNote, { tag = [] }) =>
  tag.some((t) => tags.includes(t))
