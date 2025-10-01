import { Database } from 'sqlite'

import { Config } from '../../../config'
import { lexer } from '../../../marked/main'
import { FilterOptions, MarkdownNote } from '../../../types'
import { backupBearDatabase, loadDatabase } from './database'
import { filterNotes } from './filters'
import { mapNotes } from './noteMapper'

async function openDatabase(config: Config): Promise<Database> {
  const backupFile = backupBearDatabase(config)
  if (!backupFile) {
    throw new Error('unable to backup bear database')
  }
  return loadDatabase(backupFile)
}

const sortByCreateDate = (a: MarkdownNote, b: MarkdownNote) =>
  new Date(a.created).getTime() - new Date(b.created).getTime()
export const allNotes = async (filters: FilterOptions, config: Config): Promise<MarkdownNote[]> => {
  const db = await openDatabase(config)
  const notes = (await mapNotes(db, config)).sort(sortByCreateDate)
  const filtered = filterNotes(notes, filters)
  return filtered.map((note) => ({
    ...note,
    tokens: lexer(note, notes),
  }))
}

export async function noteById(findNoteId: string, config: Config): Promise<MarkdownNote | null> {
  const notes = await allNotes({}, config)
  const note = notes.find(({ id }) => id === findNoteId)
  return note
    ? {
        ...note,
        tokens: lexer(note, notes),
      }
    : null
}
