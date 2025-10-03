/* istanbul ignore file */

import { Config } from '../config'
import { BearNote } from '../server/bear/bear.types'
import { MarkdownNote } from '../types'

/**
 * This is a helper which will cast a mock function to a jest.Mock to allow usage of the mock functions,
 * while at the same time enforcing the correct types for the function return value.
 *
 * @example
 *  const foo = (fooParam: string): boolean => fooParam === "bar";
 *  asMock(foo).mockReturnValue(true); // works
 *  asMock(foo).mockReturnValue(1); // Argument of type 'number' is not assignable to parameter of type 'boolean'
 */
// we need to disable this because the jest MockedFunction type expects `...args: any[]) => any` as the base type for T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asMock = <T extends (...args: any[]) => any>(mockTarget: T): jest.MockedFunction<T> =>
  mockTarget as jest.MockedFunction<T>

export const mockConfig = (overrides?: Partial<Config>): Config => ({
  apiUriRoot: '/api',
  bearConfig: {
    appDataRoot: '/path/to/bear',
    dbFile: 'dbfile.sqlite',
    fileRoot: 'files/',
    imageRoot: 'images/',
    openInBearUrl: '/path/in/bear?id=',
  },
  fileUriRoot: '/files',
  host: 'localhost',
  imageUriRoot: '/images',
  noteWebPath: '/path/to/web',
  port: 80,
  rootDir: '~/.root-dir',
  startupMessage: 'testing',
  ...overrides,
})

export const mockBearNote = (overrides?: Partial<BearNote>) =>
  ({
    Z_PK: 1,
    ZCREATIONDATE: 'cdate',
    ZMODIFICATIONDATE: 'mdate',
    ZTEXT: 'text',
    ZTITLE: 'title',
    ZUNIQUEIDENTIFIER: 'ABC123',
    ...overrides,
  }) as unknown as BearNote

export const mockMarkdownNote = (overrides?: Partial<MarkdownNote>): MarkdownNote => ({
  created: new Date(),
  externalUrl: '/external/path',
  files: [],
  id: 'abc123',
  modified: new Date(),
  primaryKey: 1,
  self: '/path/to/self',
  tags: [],
  text: 'note text',
  title: 'note title',
  ...overrides,
})
