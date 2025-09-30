import { static as expressStatic, Router } from 'express'

import { Config } from '../../config'
import { activity, expandPath } from '../../util'

export function createStaticRoutes(config: Config) {
  const router = Router()

  const {
    bearConfig: { appDataRoot, fileRoot, imageRoot },
    fileUriRoot,
    imageUriRoot,
    webAssets,
    webIndex,
  } = config

  const imageFsRoot = `${expandPath(appDataRoot)}/${imageRoot}`
  router.use(imageUriRoot, expressStatic(imageFsRoot))

  const fileFsRoot = `${expandPath(appDataRoot)}/${fileRoot}`
  router.use(fileUriRoot, expressStatic(fileFsRoot))

  if (webAssets) {
    activity(`serving web assets from: ${webAssets}`)
    router.use(expressStatic(webAssets))
  }

  if (webIndex) {
    activity(`serving web from: ${webIndex}`)
    router.get('/{*splat}', async (_req, res) => res.sendFile(webIndex))
  }

  return router
}
