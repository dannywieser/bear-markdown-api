import { FilterOptions, MarkdownNote } from '../../../types'

export function filterNotes(allNotes: MarkdownNote[], filters: FilterOptions) {
  return allNotes.filter((note) => {
    return matchByCreatedOrModified(note, filters)
  })
}

const matchByCreatedOrModified = (note: MarkdownNote, filters: FilterOptions) => {
  const { d, m, y } = filters
  const dates = [note.created, note.modified].map((date) => new Date(date))
  return dates.some((date) => {
    if (y && date.getFullYear() !== y) return false
    if (m && date.getMonth() + 1 !== m) return false
    if (d && date.getDate() !== d) return false
    return true
  })
}
