import { Database } from 'sqlite'

import { Config } from '../../../config'
import { MarkdownNoteSummary } from '../../../types'
import { convertDate } from '../../../util'
import { loadNotes } from './noteMapper.util'

const selfUrl = (noteId: string, { apiUriRoot, host, port }: Config) =>
  `http://${host}:${port}${apiUriRoot}/notes/${noteId}`

export async function mapNotes(db: Database, config: Config): Promise<MarkdownNoteSummary[]> {
  const bearNotes = await loadNotes(db)
  return bearNotes.map(
    ({ ZCREATIONDATE, ZMODIFICATIONDATE, ZTITLE: title, ZUNIQUEIDENTIFIER: id }) => ({
      created: convertDate(ZCREATIONDATE),
      id,
      modified: convertDate(ZMODIFICATIONDATE),
      self: selfUrl(id, config),
      title,
    })
  )
}
// const allTags = await loadTags(db)

// return Promise.all(bearNotes.map((note) => mapNote(note, db, config, allTags)))
