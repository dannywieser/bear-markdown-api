import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'

import { loadConfig } from '../config'
import { parseQuery } from './app.util'
import { loadInterface } from './interfaces/load'

const appMode = 'bear'

export const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.get('/api/notes', async (req, res, next) => {
  const filter = parseQuery(req)
  const config = await loadConfig()
  const mode = loadInterface(appMode)
  const init = await mode.init(config)
  try {
    const result = await mode.allNotes(filter, init)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

app.get('/api/notes/:noteId', async ({ params: { noteId } }, res, next) => {
  const config = await loadConfig()
  const mode = loadInterface(appMode)
  const init = await mode.init(config)
  try {
    const result = await mode.noteById(noteId, init)
    if (!result) {
      return res.status(404).json({ error: `note with ID '${noteId}' not found` })
    }
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})
