import { Spin } from 'antd'
import type { FC } from 'react'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

const Root: FC = () => {
  return (
    <Suspense
      fallback={
        <Spin
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
          }}
        />
      }
    >
      <Outlet />
    </Suspense>
  )
}

export default Root
