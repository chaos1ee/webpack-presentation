import { randNumber } from '@ngneat/falso'
import * as jose from 'jose'
import type { RestRequest } from 'msw'
import { context, response } from 'msw'
import { SECRET } from '~/constants'

export function randomArray({ min, max }: { min: number; max: number }) {
  return Array.from({ length: randNumber({ min, max, precision: 1 }) })
}

export function mockResponse<T>(data: T) {
  return response(
    context.json<BackendResponse<T>>({
      msg: 'ok',
      data,
    }),
  )
}

export function mockListResponse<T>(mockFn: () => T) {
  return response(
    context.json<BackendResponse<ListResponse<T>>>({
      msg: 'ok',
      data: {
        List: randomArray({ min: 1, max: 10 }).map(mockFn),
        Page: 1,
        PerPage: 10,
        Total: 30,
      },
    }),
  )
}

const ignoredPaths = ['/api/usystem/user/login']

const tokenPrefix = 'Bearer '

const res401 = response(context.status(401), context.body('Unauthorized'))

export async function tokenResolver(req: RestRequest) {
  if (ignoredPaths.includes(req.url.pathname)) {
    req.passthrough()
  } else {
    const headers = req.headers
    const header = headers.get('authorization')

    if (header && header.startsWith(tokenPrefix)) {
      try {
        await jose.jwtVerify(header.replace(tokenPrefix, ''), SECRET)
        req.passthrough()
      } catch (_) {
        return res401
      }
    } else {
      return res401
    }
  }
}

export function ignoredResover() {
  return response(context.json({ msg: 'ok' }))
}
