import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'

import { Config, loadConfig } from '../config'
import { activity, header1 } from '../util'
import { loadInterface } from './interfaces/load'
import { createNotesRoutes } from './routes/notesRoutes'
import { createStaticRoutes } from './routes/staticRoutes'

export const startMessage = ({ host, port, rootDir }: Config) => {
  activity(`server running: http://${host}:${port}`)
  activity(`root directory: ${rootDir}`)
  activity(`config file: ${rootDir}/config.json`)
}

export const startup = async (overrides?: Partial<Config>) => {
  const config = await loadConfig(overrides)
  const { startupMessage } = config
  const { host, port } = config
  header1(startupMessage)

  const app = express()
  const mode = loadInterface('bear')
  const init = await mode.init(config)

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

  app.use(createNotesRoutes(mode, init))
  app.use(createStaticRoutes(config))

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  })

  const server = app.listen(port, host, () => startMessage(config))
  server.on('error', (err) => {
    console.error('server error:', err)
    process.exit(1)
  })
}
