import { lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import items from '~/items'
import Layout from '~/layouts/Layout'
import NavBar from '~/layouts/NavBar'

import bulletinRoutes from '~/pages/bulletin'
import mailRoutes from '~/pages/mail'
import permissionRoutes from '~/pages/permission'
import serverRoutes from '~/pages/server'

const Root = lazy(() => import('~/pages/Root'))
const NoMatch = lazy(() => import('~/pages/NoMatch'))
const Login = lazy(() => import('~/pages/Login'))

const routes = [...bulletinRoutes, ...mailRoutes, ...serverRoutes, ...permissionRoutes]

// PNPM 的符号链接方式可能会导致 Typescript 的一些错误（"The inferred type of 'router' cannot be named without a reference to 'xxx'. This is likely not portable. A type annotation is necessary"）
// 解决方案可以参照 https://github.com/microsoft/TypeScript/issues/42873#issuecomment-1372144595。
// node-linker 说明 https://pnpm.io/zh/npmrc#node-linker。
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          element: <Layout nav={<NavBar items={items} />} />,
          children: routes,
        },
        {
          index: true,
          element: <Navigate to={'/bulletin'} />,
        },
      ],
    },
    {
      path: '*',
      element: <NoMatch />,
    },
  ],
  { basename: process.env.BASE_URL || '/' },
)

export default router
