import { Config } from '../../config'
import { FilterOptions, MarkdownNote } from '../../types'

export interface MarkdownInterfaceMode {
  allNotes: (filter: FilterOptions, config: Config) => Promise<MarkdownNote[]>
  noteById: (noteId: string, config: Config) => Promise<MarkdownNote | undefined>
  randomNote: (config: Config) => Promise<MarkdownNote | undefined>
}
