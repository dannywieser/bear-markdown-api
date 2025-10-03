import express, { Express } from 'express'
import { Database } from 'sqlite'

import { loadConfig } from '../config'
import { asMock, mockConfig } from '../testing-support'
import { openDatabase } from './bear'
import { createNotesRoutes, createStaticRoutes } from './routes'
import { startup } from './server'

jest.mock('./routes')
jest.mock('../config')
jest.mock('../util')
jest.mock('express')
jest.mock('./bear')
jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))

const mockDb = {} as unknown as Database
const setupMocks = () => {
  const listener = { on: jest.fn() }
  const listen = jest.fn().mockReturnValue(listener)
  const expressMock = {
    listen,
    use: jest.fn(),
  }
  asMock(express).mockReturnValue(expressMock as unknown as Express)
  asMock(openDatabase).mockResolvedValue(mockDb)
  return { expressMock }
}

const config = mockConfig()

describe('server startup', () => {
  beforeEach(() => {
    asMock(loadConfig).mockResolvedValue(config)
  })

  test('opens database', async () => {
    setupMocks()

    await startup()

    expect(openDatabase).toHaveBeenCalledWith(config)
  })

  test('correctly registers routes', async () => {
    const { expressMock } = setupMocks()

    await startup()

    expect(expressMock.use).toHaveBeenCalledTimes(4)
    expect(createNotesRoutes).toHaveBeenCalledWith(config, mockDb)
    expect(createStaticRoutes).toHaveBeenCalledWith(config)
  })

  test('server listener startup', async () => {
    const { expressMock } = setupMocks()

    await startup()
    expect(expressMock.listen).toHaveBeenCalledWith(80, 'localhost', expect.any(Function))
  })
})
