import express from 'express'
import request from 'supertest'

import { asMock, mockMarkdownNote } from '../testing-support'
import { expandPath } from '../util'
import { MarkdownInit, MarkdownInterfaceMode } from './interfaces/interfaces.types'
import { createNotesRoutes } from './routes/notesRoutes'

jest.mock('../util')

const mockNote = mockMarkdownNote({ id: 'abc' })
const mockAllNotes = jest.fn().mockResolvedValue([mockNote])
const mockNoteById = jest.fn().mockResolvedValue(mockNote)
const mockMode = {
  allNotes: mockAllNotes,
  noteById: mockNoteById,
} as unknown as MarkdownInterfaceMode
const mockInit = {} as unknown as MarkdownInit

describe('main server', () => {
  let app: express.Express
  beforeEach(() => {
    asMock(expandPath).mockImplementation((path: string) => `expanded/${path}`)
    app = express()
    app.use(createNotesRoutes(mockMode, mockInit))
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
