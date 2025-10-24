import { Router } from 'express'

import { Config } from '../../config'
import { parseQuery } from '../../util'
import { allNotes, openDatabase } from '../bear'
import { allFiles } from '../bear/files'
import { loadTags } from '../bear/tags'

export function createStatsRoutes(config: Config) {
  const router = Router()

  router.get('/api/stats', async (req, res, next) => {
    let db
    try {
      db = await openDatabase(config)
      const filter = parseQuery(req)
      const notes = await allNotes(filter, config, db)
      const tags = await loadTags(db)
      const files = await allFiles(db)

      const stats = {
        files: files.filter(({ type }) => type === 'file').length,
        images: files.filter(({ type }) => type === 'image').length,
        notes: notes.length,
        tags: tags.length,
      }

      res.json(stats)
    } catch (err) {
      next(err)
    } finally {
      if (db) {
        db.close()
      }
    }
  })

  return router
}
