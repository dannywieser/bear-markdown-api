import { TokensList } from 'marked'
import { Database } from 'sqlite'

import { lexer } from '../../../marked/main'
import { asMock, mockConfig, mockMarkdownNote } from '../../../testing-support'
import { backupBearDatabase, loadDatabase } from './database'
import { allNotes, init, noteById } from './main'
import { mapNotes } from './noteMapper'

jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))
jest.mock('./database')
jest.mock('./noteMapper')
jest.mock('../../../marked/main')

const db = {} as Database
describe('bear interface functions', () => {
  test('init backs up the database, loads it, and returns allNotes', async () => {
    asMock(backupBearDatabase).mockReturnValue('backup.sqlite')

    asMock(loadDatabase).mockResolvedValue(db)
    const notes = [mockMarkdownNote({ id: 'a' }), mockMarkdownNote({ id: 'b' })]
    asMock(mapNotes).mockResolvedValue(notes)
    const config = mockConfig()

    const result = await init(config)

    expect(backupBearDatabase).toHaveBeenCalled()
    expect(loadDatabase).toHaveBeenCalledWith('backup.sqlite')
    expect(mapNotes).toHaveBeenCalledWith(db, config)
    expect(result).toEqual({ allNotes: notes, config, db })
  })

  test('noteById returns note with tokens when found', async () => {
    const allNotes = [mockMarkdownNote({ id: 'abc' }), mockMarkdownNote({ id: 'def' })]
    const tokens = ['token'] as unknown as TokensList
    asMock(lexer).mockReturnValue(tokens)
    const config = mockConfig()

    const result = await noteById('abc', { allNotes, config, db })

    expect(result).toEqual({
      ...allNotes[0],
      files: [],
      tokens: tokens,
    })
    expect(lexer).toHaveBeenCalledWith(allNotes[0], allNotes)
  })

  test('noteById returns null when note not found', async () => {
    const allNotes = [mockMarkdownNote({ id: 'abc' }), mockMarkdownNote({ id: 'efg' })]
    const config = mockConfig()

    const result = await noteById('def', { allNotes, config, db })

    expect(result).toBeNull()
  })

  test('allNotes returns the all notes array directly', async () => {
    const notes = [mockMarkdownNote({ id: 'abc' }), mockMarkdownNote({ id: 'efg' })]
    const config = mockConfig()

    const result = await allNotes({}, { allNotes: notes, config, db })

    expect(result).toEqual(notes)
  })
})
