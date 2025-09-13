import { Database } from 'sqlite'

import { Config } from '../../../config'
import { MarkdownNote } from '../../../types'
import { loadNotes, loadTags, mapNote } from './noteMapper.util'

export async function mapNotes(db: Database, config: Config): Promise<MarkdownNote[]> {
  const bearNotes = await loadNotes(db)
  const allTags = await loadTags(db)

  return Promise.all(bearNotes.map(async (note) => await mapNote(note, db, config, allTags)))
}
