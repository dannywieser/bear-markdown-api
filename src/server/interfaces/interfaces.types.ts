import { Config } from '../../config'
import { FilterOptions, MarkdownNote, MarkdownNoteSummary } from '../../types'

export interface MarkdownInterfaceMode {
  allNotes: (filter: FilterOptions, config: Config) => Promise<MarkdownNoteSummary[]>
  noteById: (noteId: string, config: Config) => Promise<MarkdownNote | undefined>
  randomNote: (config: Config) => Promise<MarkdownNote | undefined>
}
