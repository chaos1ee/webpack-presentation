import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const BulletinList = lazy(() => import('./BulletinList'))
const BulletinDetail = lazy(() => import('./BulletinDetail'))

const routes: RouteObject[] = [
  {
    path: 'bulletin',
    children: [
      {
        index: true,
        element: <BulletinList />,
      },
      {
        path: ':id',
        element: <BulletinDetail />,
      },
    ],
  },
]

export default routes
