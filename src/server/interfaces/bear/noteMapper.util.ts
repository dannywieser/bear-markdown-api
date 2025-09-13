import { Database } from 'sqlite'

import { Config } from '../../../config'
import { MarkdownNote, MarkdownTag } from '../../../types'
import { convertDate } from '../../../util'
import { BearFile, BearNote, BearTag, BearTagRel } from './bear.types'

export async function getFilesForNote({ Z_PK }: BearNote, config: Config, db: Database) {
  const { imageUriRoot } = config
  const files = await db.all<BearFile[]>('SELECT * FROM ZSFNOTEFILE where ZNOTE = ?', Z_PK)

  return files
    ? files.map(({ ZFILENAME, ZUNIQUEIDENTIFIER }) => ({
        directory: ZUNIQUEIDENTIFIER,
        file: ZFILENAME,
        path: `${imageUriRoot}/${ZUNIQUEIDENTIFIER}/${ZFILENAME}`,
      }))
    : []
}

export async function getTagsForNote(
  { Z_PK }: BearNote,
  allTags: MarkdownTag[],
  db: Database
): Promise<string[]> {
  const noteTags = await db.all<BearTagRel[]>('SELECT * FROM Z_5TAGS WHERE Z_5NOTES = ?', Z_PK)
  return noteTags.map(({ Z_13TAGS }) => {
    const matched = allTags.find(({ id }) => id === Z_13TAGS)
    return matched ? matched.title : 'invalid'
  })
}

export async function loadTags(db: Database): Promise<MarkdownTag[]> {
  const allTags = await db.all<BearTag[]>('SELECT * FROM ZSFNOTETAG')

  return allTags.map(({ Z_PK: id, ZTAGCON: icon, ZTITLE: title }) => ({
    icon,
    id,
    title,
  }))
}

export const loadNotes = (db: Database): Promise<BearNote[]> =>
  db.all(`SELECT * FROM ZSFNOTE where ZTRASHED = 0`)

const selfUrl = (noteId: string, { apiUriRoot, host, port }: Config) =>
  `http://${host}:${port}${apiUriRoot}/notes/${noteId}`
const bearUrl = (noteId: string, { bearConfig: { openInBearUrl } }: Config) =>
  `${openInBearUrl}${noteId}`
const webUrl = (noteId: string, { noteWebPath }: Config) => `${noteWebPath}/${noteId}`

export const mapNote = async (
  note: BearNote,
  db: Database,
  config: Config,
  allTags: MarkdownTag[]
): Promise<MarkdownNote> => {
  const { ZCREATIONDATE, ZMODIFICATIONDATE, ZTEXT, ZTITLE, ZUNIQUEIDENTIFIER: id } = note
  const files = note ? await getFilesForNote(note, config, db) : []
  const tags = note ? await getTagsForNote(note, allTags, db) : []

  return {
    created: convertDate(ZCREATIONDATE),
    externalUrl: bearUrl(id, config),
    files,
    id,
    modified: convertDate(ZMODIFICATIONDATE),
    noteUrl: webUrl(id, config),
    self: selfUrl(id, config),
    source: 'bear',
    tags,
    text: ZTEXT,
    title: ZTITLE,
  }
}
