import express, { Express } from 'express'

import { loadConfig } from '../config'
import { asMock, mockConfig } from '../testing-support'
import { MarkdownInterfaceMode } from './interfaces/interfaces.types'
import { loadInterface } from './interfaces/load'
import { createNotesRoutes, createStaticRoutes } from './routes'
import { startup } from './server'

jest.mock('./routes')
jest.mock('../config')
jest.mock('../util')
jest.mock('./interfaces/load')
jest.mock('express')
jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))

const setupMocks = () => {
  const interfaceMode = {} as unknown as MarkdownInterfaceMode
  asMock(loadInterface).mockReturnValue(interfaceMode)

  const listener = { on: jest.fn() }
  const listen = jest.fn().mockReturnValue(listener)
  const expressMock = {
    listen,
    use: jest.fn(),
  }
  asMock(express).mockReturnValue(expressMock as unknown as Express)
  return { expressMock, interfaceMode }
}

const config = mockConfig()

describe('server startup', () => {
  beforeEach(() => {
    asMock(loadConfig).mockResolvedValue(config)
  })

  test('correctly registers routes', async () => {
    const { expressMock, interfaceMode } = setupMocks()

    await startup()

    expect(expressMock.use).toHaveBeenCalledTimes(4)
    expect(createNotesRoutes).toHaveBeenCalledWith(interfaceMode, config)
    expect(createStaticRoutes).toHaveBeenCalledWith(config)
  })

  test('server listener startup', async () => {
    const { expressMock } = setupMocks()

    await startup()
    expect(expressMock.listen).toHaveBeenCalledWith(80, 'localhost', expect.any(Function))
  })
})
