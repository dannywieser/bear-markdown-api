import { TokensList } from 'marked'

export interface MarkdownNote {
  created: Date
  externalUrl: string
  files: MarkdownNoteFile[]
  id: string
  modified: Date
  noteUrl?: string
  primaryKey?: number
  self: string
  source: MarkdownNoteSource
  sourceFile?: string
  tags: string[]
  text?: string
  title: string
  tokens?: TokensList
}

export interface MarkdownNoteFile {
  directory: string
  file: string
  path: string
}

export type MarkdownNoteSource = 'bear'

export interface MarkdownTag {
  icon: string
  id: number
  title: string
}
