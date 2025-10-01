import { Router } from 'express'

import { Config } from '../../config'
import { parseQuery } from '../../util'
import { MarkdownInterfaceMode } from '../interfaces/interfaces.types'

export function createNotesRoutes(mode: MarkdownInterfaceMode, config: Config) {
  const router = Router()

  router.get('/api/notes', async (req, res, next) => {
    try {
      const filter = parseQuery(req)
      const result = await mode.allNotes(filter, config)
      res.json(result)
    } catch (err) {
      next(err)
    }
  })

  router.get('/api/notes/:noteId', async (req, res, next) => {
    try {
      const result = await mode.noteById(req.params.noteId, config)
      if (!result) {
        return res.status(404).json({ error: `note with ID '${req.params.noteId}' not found` })
      }
      res.json(result)
    } catch (err) {
      next(err)
    }
  })

  return router
}
