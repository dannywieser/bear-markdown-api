import { Database } from 'sqlite'

import { MarkdownTag } from '../../types'
import { BearNote, BearTag, BearTagRel } from './bear.types'

export async function getTagsForNote(
  { Z_PK, ZUNIQUEIDENTIFIER }: BearNote,
  allTags: MarkdownTag[],
  db: Database
): Promise<string[]> {
  const noteTags = await db.all<BearTagRel[]>('SELECT * FROM Z_5TAGS WHERE Z_5NOTES = ?', Z_PK)
  return noteTags.map(({ Z_13TAGS }) => {
    const matched = allTags.find(({ id }) => id === Z_13TAGS)
    if (!matched) {
      console.error(`invalid tag mapping for note with id "${ZUNIQUEIDENTIFIER}": ${Z_13TAGS}`)
    }
    return matched ? matched.title : `invalid tag id: ${Z_13TAGS}`
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
