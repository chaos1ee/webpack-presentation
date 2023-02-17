import type { RestHandler } from 'msw'
import { rest, setupWorker } from 'msw'
import { ignoredResover, importAll, tokenResolver } from '~/utils'

const handlers = importAll<RestHandler>(require.context('./handlers', false, /\.ts$/))

export const worker = setupWorker(
  rest.all('/api/*', tokenResolver),
  ...handlers,
  // Ignore all unhandled requests start with '/api'.
  rest.all('/api/*', ignoredResover),
)
