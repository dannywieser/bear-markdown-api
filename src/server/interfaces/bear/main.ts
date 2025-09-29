import { Config } from '../../../config'
import { lexer } from '../../../marked/main'
import { FilterOptions, MarkdownNote } from '../../../types'
import { MarkdownInit } from '../interfaces.types'
import { backupBearDatabase, loadDatabase } from './database'
import { filterNotes } from './filters'
import { mapNotes } from './noteMapper'

export const allNotes = async (
  filters: FilterOptions,
  { allNotes = [] }: MarkdownInit
): Promise<MarkdownNote[]> => {
  const filtered = filterNotes(allNotes, filters)
  return filtered.map((note) => ({
    ...note,
    tokens: lexer(note, allNotes),
  }))
}

export async function init(config: Config): Promise<MarkdownInit> {
  const backupFile = backupBearDatabase(config)
  if (!backupFile) {
    throw new Error('unable to backup bear database')
  }
  const db = await loadDatabase(backupFile)
  const allNotes = (await mapNotes(db, config)).sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  )
  return { allNotes, config, db }
}

export async function noteById(
  findNoteId: string,
  init: MarkdownInit
): Promise<MarkdownNote | null> {
  const { allNotes = [] } = init
  const note = allNotes.find(({ id }) => id === findNoteId)
  return note
    ? {
        ...note,
        tokens: lexer(note, allNotes),
      }
    : null
}
