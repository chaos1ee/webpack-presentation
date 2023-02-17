import { randImg, randParagraph, randText, randUrl, randUuid } from '@ngneat/falso'
import { rest } from 'msw'
import type { Bulletin } from '~/features/bulletin'
import { mockListResponse, mockResponse, unixTimestamp } from '~/utils'

const handlers = [
  rest.get('/api/bulletin/list', () => {
    return mockListResponse<Bulletin>(() => ({
      ID: randUuid(),
      Constraint: {
        StartTime: unixTimestamp(),
        EndTime: unixTimestamp(),
      },
      I18nData: {
        cn: {
          Title: randText(),
          BackgroundImg: randImg(),
          GotoURL: randUrl(),
          Content: randParagraph(),
          Items: {
            1: 2,
            2: 2,
          },
        },
      },
    }))
  }),
  rest.get('/api/bulletin/get', () => {
    return mockResponse<Bulletin>({
      ID: randUuid(),
      Constraint: {
        StartTime: unixTimestamp(),
        EndTime: unixTimestamp(),
      },
      I18nData: {
        '': {
          Title: randText(),
          BackgroundImg: randImg(),
          GotoURL: randUrl(),
          Content: randParagraph(),
          Items: {
            item1: 10,
          },
        },
        cn: {
          Title: randText(),
          BackgroundImg: randImg(),
          GotoURL: randUrl(),
          Content: randParagraph(),
          Items: {
            item1: 10,
            item2: 10,
            item3: 10,
            item4: 10,
            item5: 10,
            item6: 10,
          },
        },
        en: {
          Title: randText(),
          BackgroundImg: randImg(),
          GotoURL: randUrl(),
          Content: randParagraph(),
          Items: {
            item1: 10,
            item2: 10,
          },
        },
      },
    })
  }),
]

export default handlers
