import { Database } from 'sqlite'

import { Config } from '../../config'
import { MarkdownNote, MarkdownTag } from '../../types'
import { convertDate } from '../../util'
import { BearNote } from './bear.types'
import { getFilesForNote } from './files'
import { getTagsForNote, loadTags } from './tags'

const selfUrl = (noteId: string, { apiUriRoot, host, port }: Config) =>
  `http://${host}:${port}${apiUriRoot}/notes/${noteId}`

const bearUrl = (noteId: string, { bearConfig: { openInBearUrl } }: Config) =>
  `${openInBearUrl}${noteId}`

const webUrl = (noteId: string, { noteWebPath }: Config) => `${noteWebPath}/${noteId}`

const loadNotes = (db: Database): Promise<BearNote[]> =>
  db.all(`SELECT * FROM ZSFNOTE where ZTRASHED = 0 and ZENCRYPTED = 0`)

const mapNote = async (
  note: BearNote,
  db: Database,
  config: Config,
  allTags: MarkdownTag[]
): Promise<MarkdownNote> => {
  const { ZCREATIONDATE, ZMODIFICATIONDATE, ZTEXT, ZTITLE, ZUNIQUEIDENTIFIER: id } = note
  const files = await getFilesForNote(note, config, db)
  const tags = await getTagsForNote(note, allTags, db)

  return {
    created: convertDate(ZCREATIONDATE),
    externalUrl: bearUrl(id, config),
    files,
    id,
    modified: convertDate(ZMODIFICATIONDATE),
    noteUrl: webUrl(id, config),
    self: selfUrl(id, config),
    tags,
    text: ZTEXT,
    title: ZTITLE,
  }
}

export async function mapNotes(db: Database, config: Config): Promise<MarkdownNote[]> {
  const rawNotes = await loadNotes(db)
  const allTags = await loadTags(db)
  return Promise.all(rawNotes.map((note) => mapNote(note, db, config, allTags)))
}
