import { TokensList } from 'marked'
import { Database } from 'sqlite'

import { lexer } from '../../marked/main'
import { asMock, mockConfig, mockMarkdownNote } from '../../testing-support'
import { allNotes, noteById, randomNote } from './main'
import { mapNotes } from './note'

jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))
jest.mock('./note')
jest.mock('../../marked/main')
const mockNotes = [mockMarkdownNote({ id: 'abc' }), mockMarkdownNote({ id: 'efg' })]

const mockDb = {} as unknown as Database
describe('bear functions', () => {
  test('noteById returns note with tokens when found', async () => {
    const tokens = ['token'] as unknown as TokensList
    asMock(lexer).mockReturnValue(tokens)
    asMock(mapNotes).mockResolvedValue(mockNotes)
    const config = mockConfig()

    const result = await noteById('abc', config, mockDb)

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

    const result = await noteById('def', config, mockDb)

    expect(result).not.toBeDefined()
  })

  test('allNotes returns all notes without filtering', async () => {
    const config = mockConfig()
    asMock(mapNotes).mockResolvedValue(mockNotes)

    const result = await allNotes({}, config, mockDb)

    expect(result[0]?.id).toEqual(mockNotes[0]?.id)
    expect(result[1]?.id).toEqual(mockNotes[1]?.id)
  })

  test('allNotes returns the filtered notes', async () => {
    const config = mockConfig()
    asMock(mapNotes).mockResolvedValue(mockNotes)

    const result = await allNotes({}, config, mockDb)

    expect(result[0]?.id).toEqual(mockNotes[0]?.id)
    expect(result[1]?.id).toEqual(mockNotes[1]?.id)
  })

  test('randomNote returns a randomized note', async () => {
    const tokens = ['token'] as unknown as TokensList
    asMock(lexer).mockReturnValue(tokens)
    asMock(mapNotes).mockResolvedValue(mockNotes)
    const config = mockConfig()

    const result = await randomNote(config, mockDb)

    expect(result).not.toBeNull()
    expect(mockNotes.some(({ id }) => id === result?.id)).toBeTruthy()
  })
})
