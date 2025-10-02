import { TokensList } from 'marked'

import { lexer } from '../../../marked/main'
import { asMock, mockConfig, mockMarkdownNote } from '../../../testing-support'
import { backupBearDatabase } from './database'
import { allNotes, noteById } from './main'
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
const mockNotes = [mockMarkdownNote({ id: 'abc' }), mockMarkdownNote({ id: 'efg' })]

describe('bear interface functions', () => {
  beforeEach(() => {
    asMock(backupBearDatabase).mockReturnValue('backupdb.sqlite')
  })
  test('noteById returns note with tokens when found', async () => {
    const tokens = ['token'] as unknown as TokensList
    asMock(lexer).mockReturnValue(tokens)
    asMock(mapNotes).mockResolvedValue(mockNotes)
    const config = mockConfig()

    const result = await noteById('abc', config)

    expect(result).toEqual({
      ...mockNotes[0],
      files: [],
      tokens: tokens,
    })
    expect(lexer).toHaveBeenCalledWith(mockNotes[0], mockNotes)
  })

  test('noteById returns null when note not found', async () => {
    const config = mockConfig()
    asMock(mapNotes).mockResolvedValue([])

    const result = await noteById('def', config)

    expect(result).not.toBeDefined()
  })

  test('allNotes returns the filtered notes', async () => {
    const config = mockConfig()
    asMock(mapNotes).mockResolvedValue(mockNotes)

    const result = await allNotes({}, config)

    expect(result[0]?.id).toEqual(mockNotes[0]?.id)
    expect(result[1]?.id).toEqual(mockNotes[1]?.id)
  })
})
