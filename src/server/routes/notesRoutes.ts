import { Router } from 'express'
import { Database } from 'sqlite'

import { Config } from '../../config'
import { parseQuery } from '../../util'
import { allNotes, noteById, randomNote } from '../bear'

export function createNotesRoutes(config: Config, db: Database) {
  const router = Router()

  router.get('/api/notes', async (req, res, next) => {
    try {
      const filter = parseQuery(req)
      const result = await allNotes(filter, config, db)
      res.json(result)
    } catch (err) {
      next(err)
    }
  })

  router.get('/api/notes/random', async (_req, res, next) => {
    try {
      const result = await randomNote(config, db)
      if (!result) {
        return res.status(404).json({ error: `could not retrieve random note` })
      }
      res.json(result)
    } catch (err) {
      next(err)
    }
  })

  router.get('/api/notes/:noteId', async (req, res, next) => {
    const {
      params: { noteId },
    } = req
    try {
      const result = await noteById(noteId, config, db)
      if (!result) {
        return res.status(404).json({ error: `note with ID '${noteId}' not found` })
      }
      res.json(result)
    } catch (err) {
      next(err)
    }
  })

  return router
}
