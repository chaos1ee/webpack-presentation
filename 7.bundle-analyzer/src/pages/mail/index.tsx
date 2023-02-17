import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const MailList = lazy(() => import('./MailList'))

const routes: RouteObject[] = [
  {
    path: 'mail',
    children: [
      {
        index: true,
        element: <MailList />,
      },
    ],
  },
]

export default routes
