import { Database, open } from 'sqlite'
import * as sqlite3 from 'sqlite3'

import { Config } from '../../config'
import { lexer } from '../../marked/main'
import { FilterOptions, MarkdownNote } from '../../types'
import { expandPath } from '../../util'
import { filterNotes } from './filters'
import { mapNotes } from './note'

export async function openDatabase(config: Config): Promise<Database> {
  const {
    bearConfig: { appDataRoot, dbFile },
  } = config
  const filename = `${expandPath(appDataRoot)}/${dbFile}`
  const driver = sqlite3.Database
  return open({ driver, filename, mode: sqlite3.OPEN_READONLY })
}

const sortByCreateDate = (a: MarkdownNote, b: MarkdownNote) =>
  new Date(a.created).getTime() - new Date(b.created).getTime()

const tokenizeNote = (note: MarkdownNote | undefined, notes: MarkdownNote[]) =>
  note
    ? {
        ...note,
        tokens: lexer(note, notes),
      }
    : undefined

export const allNotes = async (
  filters: FilterOptions,
  config: Config,
  db: Database
): Promise<MarkdownNote[]> => {
  const notes = (await mapNotes(db, config)).sort(sortByCreateDate)
  return filterNotes(notes, filters)
}

export async function noteById(
  findNoteId: string,
  config: Config,
  db: Database
): Promise<MarkdownNote | undefined> {
  const notes = await allNotes({}, config, db)
  const note = notes.find(({ id }) => id === findNoteId)
  return tokenizeNote(note, notes)
}

export async function randomNote(config: Config, db: Database): Promise<MarkdownNote | undefined> {
  const notes = await allNotes({}, config, db)
  if (notes.length === 0) {
    return undefined
  }
  const randomIndex = Math.floor(Math.random() * notes.length)
  const note = notes[randomIndex]
  return tokenizeNote(note, notes)
}
