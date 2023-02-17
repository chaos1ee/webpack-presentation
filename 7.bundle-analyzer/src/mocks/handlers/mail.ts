import { randNumber, randText } from '@ngneat/falso'
import { rest } from 'msw'
import { mockListResponse } from '~/utils'

const handlers = [
  rest.get('/mail/get', () => {
    return mockListResponse(() => ({
      ID: randNumber(),
      Title: randText(),
      Items: Array.from({ length: randNumber({ max: 4 }) }).map(() => {
        return {
          ItemId: randNumber(),
          ItemCount: randNumber({ min: 1, max: 1000 }),
        }
      }),
    }))
  }),
]

export default handlers
