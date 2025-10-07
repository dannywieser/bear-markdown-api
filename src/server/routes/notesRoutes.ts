import { Router } from 'express'

import { Config } from '../../config'
import { parseQuery } from '../../util'
import { allNotes, noteById, openDatabase, randomNote } from '../bear'

export function createNotesRoutes(config: Config) {
  const router = Router()

  router.get('/api/notes', async (req, res, next) => {
    let db
    try {
      db = await openDatabase(config)
      const filter = parseQuery(req)
      const result = await allNotes(filter, config, db)
      res.json(result)
    } catch (err) {
      next(err)
    } finally {
      if (db) {
        db.close()
      }
    }
  })

  router.get('/api/notes/random', async (_req, res, next) => {
    let db
    try {
      db = await openDatabase(config)
      const result = await randomNote(config, db)
      if (!result) {
        return res.status(404).json({ error: `could not retrieve random note` })
      }
      res.json(result)
    } catch (err) {
      next(err)
    } finally {
      if (db) {
        db.close()
      }
    }
  })

  router.get('/api/notes/:noteId', async (req, res, next) => {
    const {
      params: { noteId },
    } = req
    let db
    try {
      db = await openDatabase(config)
      const result = await noteById(noteId, config, db)
      if (!result) {
        return res.status(404).json({ error: `note with ID '${noteId}' not found` })
      }
      res.json(result)
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
