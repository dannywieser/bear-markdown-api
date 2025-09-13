import { Database } from 'sqlite'

import { asMock, mockBearNote, mockConfig } from '../../../testing-support'
import { getFilesForNote, getTagsForNote, loadTags } from './noteMapper.util'

const setupMocks = () => {
  const config = mockConfig()
  const db = { all: jest.fn() } as unknown as Database
  const note = mockBearNote({ Z_PK: 1 })
  return { config, db, note }
}

describe('getFilesForNote', () => {
  test('correctly returns mapped results for files from DB query', async () => {
    const { config, db, note } = setupMocks()
    asMock(db.all).mockResolvedValueOnce([
      { ZFILENAME: 'file1.png', ZUNIQUEIDENTIFIER: 'dir1' },
      { ZFILENAME: 'file2.jpg', ZUNIQUEIDENTIFIER: 'dir2' },
    ])

    const result = await getFilesForNote(note, config, db)

    expect(result).toEqual([
      { directory: 'dir1', file: 'file1.png', path: '/images/dir1/file1.png' },
      { directory: 'dir2', file: 'file2.jpg', path: '/images/dir2/file2.jpg' },
    ])
    expect(db.all).toHaveBeenCalledWith('SELECT * FROM ZSFNOTEFILE where ZNOTE = ?', 1)
  })

  test('returns empty array when db returns null/undefined', async () => {
    const { config, db, note } = setupMocks()
    asMock(db.all).mockResolvedValueOnce(null)

    const result = await getFilesForNote(note, config, db)

    expect(result).toEqual([])
  })

  test('returns empty array when db returns empty array', async () => {
    const { config, db, note } = setupMocks()
    asMock(db.all).mockResolvedValueOnce([])

    const result = await getFilesForNote(note, config, db)

    expect(result).toEqual([])
  })
})

describe('getTagsForNote', () => {
  const allTags = [
    { icon: 'icon1', id: 10, title: 'tag1' },
    { icon: 'icon2', id: 20, title: 'tag2' },
    { icon: 'icon3', id: 30, title: 'tag3' },
  ]

  test('returns tag titles for matching tag ids', async () => {
    const { db, note } = setupMocks()
    asMock(db.all).mockResolvedValueOnce([{ Z_13TAGS: 10 }, { Z_13TAGS: 20 }])

    const result = await getTagsForNote(note, allTags, db)

    expect(result).toEqual(['tag1', 'tag2'])
    expect(db.all).toHaveBeenCalledWith('SELECT * FROM Z_5TAGS WHERE Z_5NOTES = ?', note.Z_PK)
  })

  test('returns "invalid" for unmatched tag ids', async () => {
    const { db, note } = setupMocks()
    asMock(db.all).mockResolvedValueOnce([{ Z_13TAGS: 40 }])

    const result = await getTagsForNote(note, allTags, db)

    expect(result).toEqual(['invalid'])
  })

  test('returns empty array when db returns empty array', async () => {
    const { db, note } = setupMocks()
    asMock(db.all).mockResolvedValueOnce([])

    const result = await getTagsForNote(note, allTags, db)

    expect(result).toEqual([])
  })
})

describe('loadTags', () => {
  test('returns mapped tags from db', async () => {
    const { db } = setupMocks()
    asMock(db.all).mockResolvedValueOnce([
      { Z_PK: 1, ZTAGCON: 'icon1', ZTITLE: 'tag1' },
      { Z_PK: 2, ZTAGCON: 'icon2', ZTITLE: 'tag2' },
    ])

    const result = await loadTags(db)

    expect(result).toEqual([
      { icon: 'icon1', id: 1, title: 'tag1' },
      { icon: 'icon2', id: 2, title: 'tag2' },
    ])
    expect(db.all).toHaveBeenCalledWith('SELECT * FROM ZSFNOTETAG')
  })

  test('returns empty array when db returns empty array', async () => {
    const { db } = setupMocks()
    asMock(db.all).mockResolvedValueOnce([])

    const result = await loadTags(db)

    expect(result).toEqual([])
  })
})
