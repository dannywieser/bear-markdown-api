import { createDir, createFile, expandPath, fileExists, readJSONFile } from '../util'
import defaultConfig from './config.default.json'
import { Config } from './config.types'

export async function loadConfig(overrides?: Partial<Config>): Promise<Config> {
  const initConfig = {
    ...defaultConfig,
    ...overrides,
  }
  const { rootDir } = initConfig
  const expandedRootDir = expandPath(rootDir)
  const configPath = `${expandedRootDir}/config.json`
  if (!fileExists(configPath)) {
    createDir(expandedRootDir)
    createFile(configPath, initConfig)
    return initConfig
  } else {
    const config = readJSONFile(configPath)
    return config
  }
}
