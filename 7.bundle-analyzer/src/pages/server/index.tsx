import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const ServerList = lazy(() => import('./ServerList'))
const Gate = lazy(() => import('./GateList'))
const Version = lazy(() => import('./Version'))
const Manifest = lazy(() => import('./Manifest'))
const DataService = lazy(() => import('./DataService'))

const routes: RouteObject[] = [
  {
    path: 'server',
    children: [
      {
        index: true,
        element: <ServerList />,
      },
      {
        path: 'gate',
        element: <Gate />,
      },
      {
        path: 'version',
        element: <Version />,
      },
      {
        path: 'manifest',
        element: <Manifest />,
      },
      {
        path: 'data',
        element: <DataService />,
      },
    ],
  },
]

export default routes
