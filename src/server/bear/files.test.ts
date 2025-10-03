import { Database } from 'sqlite'

import { asMock, mockBearNote, mockConfig } from '../../testing-support'
import { getFilesForNote } from './files'

const mockDb = { all: jest.fn() } as unknown as Database
const config = mockConfig()
const note = mockBearNote({ Z_PK: 1 })

describe('getFilesForNote', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns mapped file objects for non-image files', async () => {
    asMock(mockDb.all).mockResolvedValueOnce([
      { Z_ENT: 1, ZFILENAME: 'doc.txt', ZUNIQUEIDENTIFIER: 'abc' },
    ])
    const result = await getFilesForNote(note, config, mockDb)
    expect(result).toEqual([
      {
        directory: 'abc',
        file: 'doc.txt',
        path: '/files/abc/doc.txt',
      },
    ])
  })

  test('returns mapped file objects for image files', async () => {
    asMock(mockDb.all).mockResolvedValueOnce([
      { Z_ENT: 9, ZFILENAME: 'img.png', ZUNIQUEIDENTIFIER: 'def' },
    ])
    const result = await getFilesForNote(note, config, mockDb)
    expect(result).toEqual([
      {
        directory: 'def',
        file: 'img.png',
        path: '/images/def/img.png',
      },
    ])
  })

  test('returns empty array if no files', async () => {
    asMock(mockDb.all).mockResolvedValueOnce([])
    const result = await getFilesForNote(note, config, mockDb)
    expect(result).toEqual([])
  })

  test('returns empty array if files is undefined', async () => {
    asMock(mockDb.all).mockResolvedValueOnce(undefined)
    const result = await getFilesForNote(note, config, mockDb)
    expect(result).toEqual([])
  })
})
