import { Database } from 'sqlite'

import { asMock, mockConfig } from '../../../testing-support'
import { MarkdownTag } from '../../../types'
import { BearNote } from './bear.types'
import { mapNotes } from './noteMapper'
import { loadNotes, loadTags, mapNote } from './noteMapper.util'

jest.mock('./noteMapper.util')

describe('mapNotes', () => {
  test('invokes mapNote for each result from the Bear database', async () => {
    const notes = [{}, {}] as unknown as BearNote[]
    const tags = [{ id: 'taga' }, { id: 'tagb' }] as unknown as MarkdownTag[]
    const config = mockConfig()
    asMock(loadNotes).mockResolvedValue(notes)
    asMock(loadTags).mockResolvedValue(tags)
    const db = {} as unknown as Database

    await mapNotes(db, config)

    expect(mapNote).toHaveBeenCalledTimes(2)
    expect(mapNote).toHaveBeenCalledWith(notes[0], db, config, tags)
    expect(mapNote).toHaveBeenCalledWith(notes[1], db, config, tags)
  })
})
