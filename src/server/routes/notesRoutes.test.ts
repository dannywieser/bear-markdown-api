import express from 'express'
import { Database } from 'sqlite'
import request from 'supertest'

import { asMock, mockConfig, mockMarkdownNote } from '../../testing-support'
import { expandPath } from '../../util'
import { createNotesRoutes } from './notesRoutes'

jest.mock('../../util')
jest.mock('../bear')

const mockNote = mockMarkdownNote({ id: 'abc' })
const config = mockConfig()

const mockDb = {} as unknown as Database

describe('notes routes', () => {
  let app: express.Express
  beforeEach(() => {
    asMock(expandPath).mockImplementation((path: string) => `expanded/${path}`)
    app = express()
    app.use(createNotesRoutes(config, mockDb))
  })

  test('GET /api/notes returns notes', async () => {
    const res = await request(app).get('/api/notes')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([
      {
        ...mockNote,
        created: mockNote.created.toISOString(),
        modified: mockNote.modified.toISOString(),
      },
    ])
  })

  test('GET /api/notes/random returns a random note', async () => {
    const res = await request(app).get('/api/notes/random')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      ...mockNote,
      created: mockNote.created.toISOString(),
      modified: mockNote.modified.toISOString(),
    })
  })

  test('GET /api/notes/:noteId returns a note', async () => {
    const res = await request(app).get('/api/notes/1')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      ...mockNote,
      created: mockNote.created.toISOString(),
      modified: mockNote.modified.toISOString(),
    })
  })

  test('GET /api/notes/:noteId returns 404 if not found', async () => {
    mockNoteById.mockResolvedValueOnce(undefined)
    const res = await request(app).get('/api/notes/doesnotexist')
    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: "note with ID 'doesnotexist' not found" })
  })
})
