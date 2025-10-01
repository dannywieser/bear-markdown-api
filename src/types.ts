import { TokensList } from 'marked'

export type FilterFunction = (note: MarkdownNote, filters: FilterOptions) => boolean

export interface FilterOptions {
  d?: number | undefined
  m?: number | undefined
  tag?: string[] | undefined
  text?: string | undefined
  y?: number | undefined
}

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

export interface MarkdownNoteSummary {
  created: Date
  id: string
  modified: Date
  self: string
  title: string
}

export interface MarkdownTag {
  icon: string
  id: number
  title: string
}
