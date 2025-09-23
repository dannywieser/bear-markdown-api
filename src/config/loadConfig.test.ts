import { asMock, mockConfig } from '../testing-support'
import { createFile, expandPath, fileExists, readJSONFile } from '../util'
import { loadConfig } from './loadConfig'

jest.mock('../util')

beforeEach(() => {
  asMock(expandPath).mockImplementation((path: string) => `/expanded/${path}`)
})

describe('loadConfig', () => {
  test('creates config from default if not present', async () => {
    asMock(fileExists).mockReturnValue(false)

    const config = await loadConfig()

    expect(createFile).toHaveBeenCalledWith(
      '/expanded/~/.bear-markdown-api/config.json',
      expect.any(Object)
    )
    expect(config.rootDir).toContain('~/.bear-markdown-api')
    expect(config.bearConfig).toBeDefined()
  })

  test('allows overrides to be passed in', async () => {
    asMock(fileExists).mockReturnValue(false)

    const config = await loadConfig({ startupMessage: 'hello world' })

    expect(config.startupMessage).toBe('hello world')
  })

  test('loads config if present', async () => {
    asMock(fileExists).mockReturnValue(true)
    const fakeConfig = mockConfig()
    asMock(readJSONFile).mockReturnValue(fakeConfig)

    const config = await loadConfig()

    expect(config).toEqual(fakeConfig)
  })
})
