export interface BearConfig {
  appDataRoot: string
  dbFile: string
  fileRoot: string
  imageRoot: string
  openInBearUrl: string
}

export interface Config {
  apiUriRoot: string
  backups: number
  bearConfig: BearConfig
  fileUriRoot: string
  host: string
  imageUriRoot: string
  noteWebPath: string
  port: number
  rootDir: string
}
