import { mockMarkdownNote } from '../../../testing-support'
import { FilterOptions, MarkdownNote } from '../../../types'
import { extractDatesFromText, filterNotes } from './filters'

describe('extractDatesFromText', () => {
  test.each([
    [
      'Today is 2023.09.16 and tomorrow is 2023.09.17',
      [new Date(2023, 8, 16), new Date(2023, 8, 17)],
    ],
    ['Event: 2022-01-01', [new Date(2022, 0, 1)]],
    ['Deadline: 2025/12/31', [new Date(2025, 11, 31)]],
    ['No date here!', []],
    ['Some special chars,!/ - but still no date ... / ///', []],
  ])('extracts dates from "%s"', (input, expected) => {
    const dates = extractDatesFromText(input)
    expect(dates).toEqual(expected)
  })
})

describe('filterNotes', () => {
  const notes: MarkdownNote[] = [
    mockMarkdownNote({
      created: new Date(2023, 8, 16),
      id: '2023a',
      modified: new Date(2023, 8, 17),
      text: 'Meeting notes for project.',
    }),
    mockMarkdownNote({
      created: new Date(2023, 3, 16),
      id: '2023b',
      modified: new Date(2023, 3, 17),
    }),
    mockMarkdownNote({
      created: new Date(2022, 1, 4),
      id: '2',
      modified: new Date(2022, 1, 2),
      text: 'Random text.',
    }),
    mockMarkdownNote({
      created: new Date(2025, 12, 31),
      id: '3',
      modified: new Date(2026, 1, 1),
    }),
    mockMarkdownNote({
      created: new Date(2020, 5, 5),
      id: '4',
      modified: new Date(2020, 5, 6),
      text: '2025 is a big year.',
    }),
  ]

  test.each([
    ['year only', { y: 2023 }, ['2023a', '2023b']],
    ['year and month', { m: 4, y: 2023 }, ['2023b']],
    ['month only', { m: 4, y: 2023 }, ['2023b']],
    ['day only', { d: 4 }, ['2']],
    ['text search matches note text', { text: 'meeting' }, ['2023a']],
    ['text search matches no notes', { text: 'notfound' }, []],
    ['date or text match (any filter)', { text: '2025', y: 2023 }, ['2023a', '2023b', '4']],
    ['no filters returns all', {}, ['2023a', '2023b', '2', '3', '4']],
  ])('filters %s', (_desc, filters: FilterOptions, expected) => {
    const results = filterNotes(notes, filters)
    expect(results.map(({ id }) => id).sort()).toEqual(expected.sort())
  })
})
