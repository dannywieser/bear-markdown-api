import { Database } from 'sqlite'

import { asMock, mockBearNote } from '../../testing-support'
import { getTagsForNote, loadTags } from './tags'

const mockDb = {
  all: jest.fn(),
} as unknown as Database

const allTags = [
  { icon: 'iconA', id: 10, title: 'tagA' },
  { icon: 'iconB', id: 20, title: 'tagB' },
]

const note = mockBearNote({ Z_PK: 1, ZUNIQUEIDENTIFIER: 'note-1' })

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('getTagsForNote', () => {
  test('returns tag titles for valid tag ids', async () => {
    asMock(mockDb.all).mockResolvedValueOnce([
      { Z_13TAGS: 10, Z_5NOTES: 1 },
      { Z_13TAGS: 20, Z_5NOTES: 1 },
    ])

    const result = await getTagsForNote(note, allTags, mockDb)

    expect(result).toEqual(['tagA', 'tagB'])
  })

  test('returns error string for invalid tag id', async () => {
    const allTags = [{ icon: 'iconA', id: 10, title: 'tagA' }]
    asMock(mockDb.all).mockResolvedValue([{ Z_13TAGS: 99, Z_5NOTES: 1 }])

    const result = await getTagsForNote(note, allTags, mockDb)

    expect(result[0]).toMatch(/invalid tag id: 99/)
  })
})

describe('loadTags', () => {
  test('maps DB rows to MarkdownTag objects', async () => {
    asMock(mockDb.all).mockResolvedValueOnce([
      { Z_PK: 1, ZTAGCON: 'iconA', ZTITLE: 'tagA' },
      { Z_PK: 2, ZTAGCON: 'iconB', ZTITLE: 'tagB' },
    ])

    const result = await loadTags(mockDb)

    expect(result).toEqual([
      { icon: 'iconA', id: 1, title: 'tagA' },
      { icon: 'iconB', id: 2, title: 'tagB' },
    ])
  })
})
