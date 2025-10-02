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

const tokenizeNote = (note: MarkdownNote | undefined, notes: MarkdownNote[]) =>
  note
    ? {
        ...note,
        tokens: lexer(note, notes),
      }
    : undefined

const sortByCreateDate = (a: MarkdownNote, b: MarkdownNote) =>
  new Date(a.created).getTime() - new Date(b.created).getTime()

export const allNotes = async (filters: FilterOptions, config: Config): Promise<MarkdownNote[]> => {
  const db = await openDatabase(config)
  const notes = (await mapNotes(db, config)).sort(sortByCreateDate)
  return filterNotes(notes, filters)
}

export async function noteById(
  findNoteId: string,
  config: Config
): Promise<MarkdownNote | undefined> {
  const notes = await allNotes({}, config)
  const note = notes.find(({ id }) => id === findNoteId)
  return tokenizeNote(note, notes)
}

export async function randomNote(config: Config): Promise<MarkdownNote | undefined> {
  const notes = await allNotes({}, config)
  const randomIndex = Math.floor(Math.random() * notes.length)
  const note = notes[randomIndex]
  return tokenizeNote(note, notes)
}
