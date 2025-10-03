import { Database } from 'sqlite'

import { asMock, mockBearNote, mockConfig } from '../../testing-support'
import { convertDate } from '../../util'
import { getFilesForNote } from './files'
import { mapNotes } from './note'
import { getTagsForNote } from './tags'

jest.mock('./tags')
jest.mock('./files')
jest.mock('../../util')

const db = { all: jest.fn() } as unknown as Database
const config = mockConfig()
const note1 = mockBearNote()
const note2 = mockBearNote()

const mappedFiles = [{ directory: 'dir', file: 'doc.txt', path: '/files/dir/doc.txt' }]
const mappedTags = ['tagA', 'tagB']

describe('mapNotes', () => {
  beforeEach(() => {
    asMock(convertDate).mockImplementation((date: string) => `converted:${date}` as unknown as Date)
  })
  test('maps notes with files, tags and urls', async () => {
    asMock(db.all).mockResolvedValue([note1, note2])
    asMock(getTagsForNote).mockResolvedValue(mappedTags)
    asMock(getFilesForNote).mockResolvedValue(mappedFiles)

    const result = await mapNotes(db, config)

    expect(result[0]).toEqual({
      created: 'converted:cdate',
      externalUrl: '/path/in/bear?id=ABC123',
      files: mappedFiles,
      id: 'ABC123',
      modified: 'converted:mdate',
      noteUrl: '/path/to/web/ABC123',
      self: 'http://localhost:80/api/notes/ABC123',
      tags: mappedTags,
      text: 'text',
      title: 'title',
    })
    expect(result[1]).toEqual({
      created: 'converted:cdate',
      externalUrl: '/path/in/bear?id=ABC123',
      files: mappedFiles,
      id: 'ABC123',
      modified: 'converted:mdate',
      noteUrl: '/path/to/web/ABC123',
      self: 'http://localhost:80/api/notes/ABC123',
      tags: mappedTags,
      text: 'text',
      title: 'title',
    })
  })
})
