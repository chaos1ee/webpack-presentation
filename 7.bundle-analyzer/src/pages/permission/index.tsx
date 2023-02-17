import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const User = lazy(() => import('./User'))
const Role = lazy(() => import('./Role'))
const RoleDetail = lazy(() => import('./RoleDetail'))

const routes: RouteObject[] = [
  {
    path: 'permission',
    children: [
      {
        path: 'user',
        element: <User />,
      },
      {
        path: 'role',
        element: <Role />,
      },
      {
        path: 'role/:name',
        element: <RoleDetail />,
      },
    ],
  },
]

export default routes
