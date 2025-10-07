import express from 'express'
import { Database } from 'sqlite'
import request from 'supertest'

import { asMock, mockConfig, mockMarkdownNote } from '../../testing-support'
import { allNotes, noteById, openDatabase, randomNote } from '../bear'
import { createNotesRoutes } from './notesRoutes'

jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))
jest.mock('../../util')
jest.mock('../bear')

const config = mockConfig()

const mockDb = {} as unknown as Database
const note1 = mockMarkdownNote({ id: 'abc' })
const note2 = mockMarkdownNote({ id: 'def' })

describe('notes routes', () => {
  let app: express.Express
  beforeEach(() => {
    asMock(allNotes).mockResolvedValue([note1, note2])
    asMock(openDatabase).mockResolvedValue(mockDb)
    app = express()
    app.use(createNotesRoutes(config))
  })

  test('GET /api/notes returns all notes', async () => {
    const res = await request(app).get('/api/notes')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([
      {
        ...note1,
        created: note1.created.toISOString(),
        modified: note1.modified.toISOString(),
      },
      {
        ...note2,
        created: note2.created.toISOString(),
        modified: note2.modified.toISOString(),
      },
    ])
  })

  test('GET /api/notes/random returns a random note', async () => {
    asMock(randomNote).mockResolvedValue(note1)

    const res = await request(app).get('/api/notes/random')

    expect(res.status).toBe(200)
    expect(randomNote).toHaveBeenCalledWith(config, mockDb)
    expect(res.body).toEqual({
      ...note1,
      created: note1.created.toISOString(),
      modified: note1.modified.toISOString(),
    })
  })

  test('GET /api/notes/:noteId returns a note', async () => {
    asMock(noteById).mockResolvedValue(note1)

    const res = await request(app).get('/api/notes/abc')

    expect(res.status).toBe(200)
    expect(noteById).toHaveBeenCalledWith('abc', config, mockDb)
    expect(res.body).toEqual({
      ...note1,
      created: note1.created.toISOString(),
      modified: note1.modified.toISOString(),
    })
  })

  test('GET /api/notes/:noteId returns 404 if not found', async () => {
    asMock(noteById).mockResolvedValueOnce(undefined)

    const res = await request(app).get('/api/notes/doesnotexist')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: "note with ID 'doesnotexist' not found" })
  })
})
