import express from 'express'

import { Config, loadConfig } from '../config'
import { activity, expandPath, header1 } from '../util'
import { app } from './app'

export const startMessage = ({ host, port, rootDir }: Config, imageRoot: string) => {
  activity(`server running: http://${host}:${port}`)
  activity(`root directory: ${rootDir}`)
  activity(`config file: ${rootDir}/config.json`)
  activity(`image directory: ${imageRoot}`)
}

export const startup = async (overrides?: Partial<Config>) => {
  const config = await loadConfig(overrides)
  const {
    bearConfig: { appDataRoot, fileRoot, imageRoot },
    fileUriRoot,
    imageUriRoot,
    startupMessage,
    webAssets,
    webIndex,
  } = config
  header1(startupMessage)

  // image server
  const imageFsRoot = `${expandPath(appDataRoot)}/${imageRoot}`
  app.use(imageUriRoot, express.static(imageFsRoot))

  // file server
  const fileFsRoot = `${expandPath(appDataRoot)}/${fileRoot}`
  app.use(fileUriRoot, express.static(fileFsRoot))

  if (webAssets) {
    activity(`serving web assets from: ${webAssets}`)
    app.use(express.static(webAssets))
  }

  if (webIndex) {
    activity(`serving web from: ${webIndex}`)
    app.get('/{*splat}', async (_req, res) => res.sendFile(webIndex))
  }

  const { host, port } = config

  const server = app.listen(port, host, () => startMessage(config, imageFsRoot))
  server.on('error', (err) => {
    console.error('server error:', err)
    process.exit(1)
  })
}
