import { mockMarkdownNote } from '../../../testing-support'
import { FilterOptions, MarkdownNote } from '../../../types'
import { extractDatesFromText, filterNotes } from './filters'

describe('extractDatesFromText', () => {
  test.each([
    [
      'Today is 2023.09.16 and tomorrow is 2023.09.17',
      [new Date('2023-09-16'), new Date('2023-09-17')],
    ],
    ['Event: 2022-01-01', [new Date('2022-01-01')]],
    ['Deadline: 2025/12/31', [new Date('2025-12-31')]],
    ['No date here!', []],
  ])('extracts dates from "%s"', (input, expected) => {
    const dates = extractDatesFromText(input)
    expect(dates).toEqual(expected)
  })
})

describe('filterNotes', () => {
  const notes: MarkdownNote[] = [
    mockMarkdownNote({
      created: new Date('2023-09-16T10:00:00Z'),
      id: '2023a',
      modified: new Date('2023-09-17T10:00:00Z'),
    }),
    mockMarkdownNote({
      created: new Date('2023-04-16T10:00:00Z'),
      id: '2023b',
      modified: new Date('2023-04-17T10:00:00Z'),
    }),
    mockMarkdownNote({
      created: new Date('2022-01-01T00:00:00Z'),
      id: '2',
      modified: new Date('2022-01-02T00:00:00Z'),
    }),
    mockMarkdownNote({
      created: new Date('2025-12-31T23:59:59Z'),
      id: '3',
      modified: new Date('2026-01-01T00:00:00Z'),
    }),
    mockMarkdownNote({
      created: new Date('2020-05-05T00:00:00Z'),
      id: '4',
      modified: new Date('2020-05-06T00:00:00Z'),
    }),
  ]

  test.each([
    ['year only', { y: 2023 }, ['2023a', '2023b']],
    ['year and month', { m: 4, y: 2023 }, ['2023b']],
  ])('filters %s', (_desc, filters: FilterOptions, expected) => {
    const results = filterNotes(notes, filters)

    expect(results.length).toEqual(expected.length)
    results.map(({ id }, index) => expect(id).toEqual(expected[index]))
  })
})
