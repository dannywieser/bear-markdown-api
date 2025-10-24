import { Database } from 'sqlite'

import { Config } from '../../config'
import { BearFile, BearNote } from './bear.types'

const BEAR_TYPE_IMAGE = 9

export async function allFiles(db: Database) {
  const files = await db.all<BearFile[]>('SELECT * FROM ZSFNOTEFILE')
  const type = (type: number) => (type === BEAR_TYPE_IMAGE ? 'image' : 'file')
  return files
    ? files.map(({ Z_ENT, ZFILENAME, ZUNIQUEIDENTIFIER }) => ({
        directory: ZUNIQUEIDENTIFIER,
        file: ZFILENAME,
        type: type(Z_ENT),
      }))
    : []
}

export async function getFilesForNote({ Z_PK }: BearNote, config: Config, db: Database) {
  const { fileUriRoot, imageUriRoot } = config
  const files = await db.all<BearFile[]>('SELECT * FROM ZSFNOTEFILE where ZNOTE = ?', Z_PK)

  const root = (type: number) => (type === BEAR_TYPE_IMAGE ? imageUriRoot : fileUriRoot)
  return files
    ? files.map(({ Z_ENT, ZFILENAME, ZUNIQUEIDENTIFIER }) => ({
        directory: ZUNIQUEIDENTIFIER,
        file: ZFILENAME,
        path: `${root(Z_ENT)}/${ZUNIQUEIDENTIFIER}/${ZFILENAME}`,
      }))
    : []
}
