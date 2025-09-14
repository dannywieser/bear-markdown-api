import { Config } from '../../../config'
import { lexer } from '../../../marked/main'
import { MarkdownNote } from '../../../types'
import { MarkdownInit } from '../interfaces.types'
import { backupBearDatabase, loadDatabase } from './database'
import { mapNotes } from './noteMapper'

export async function allNotes(
  _params: unknown,
  { allNotes = [] }: MarkdownInit
): Promise<MarkdownNote[]> {
  return allNotes
}

export async function init(config: Config): Promise<MarkdownInit> {
  const backupFile = backupBearDatabase(config)
  if (!backupFile) {
    throw new Error('unable to backup bear database')
  }
  const db = await loadDatabase(backupFile)
  const allNotes = await mapNotes(db, config)
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
