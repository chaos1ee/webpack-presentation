import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Layout as AntdLayout, Divider, Dropdown, Space, Spin, Typography, theme } from 'antd'
import type { FC } from 'react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { LangSelector } from '~/components'
import { TOKEN_FLAG } from '~/constants'
import { useToken } from '~/hooks'
import type { UserInfo } from '~/services'
import { decode } from '~/utils'

const { Header, Sider, Content } = AntdLayout
const { Link } = Typography

export interface LayoutProps {
  nav?: React.ReactNode
}

const Layout: FC<LayoutProps> = props => {
  const { nav } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { token, isLoading } = useToken()

  const {
    token: { colorBgContainer, colorBorder },
  } = theme.useToken()

  if (isLoading) {
    return (
      <Spin
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
        }}
      />
    )
  }

  if (!token) {
    return <Navigate replace to="/login" />
  }

  return (
    <AntdLayout hasSider className={'h-screen'}>
      <Sider
        width={256}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRightWidth: 1,
          borderRightStyle: 'solid',
          borderRightColor: colorBorder,
        }}
        theme={'light'}
      >
        <div className={'flex items-center px-6 py-4'}>
          <img src={'/logo.svg'} className={'w-8'} alt="logo" />
          <span className={'text-black font-bold text-lg ml-2'}>{process.env.SITE_TITLE}</span>
        </div>
        {nav && <>{nav}</>}
      </Sider>
      <AntdLayout className="ml-64">
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: colorBorder,
          }}
        >
          <div className={'flex justify-end'}>
            <Space split={<Divider type="vertical" />} align={'center'}>
              {token && (
                <Dropdown
                  menu={{
                    selectable: true,
                    items: [
                      {
                        key: '1',
                        label: (
                          <Link
                            onClick={() => {
                              localStorage.removeItem(TOKEN_FLAG)
                              navigate('/login')
                            }}
                          >
                            {t('logout')}
                          </Link>
                        ),
                        icon: <LogoutOutlined />,
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Link>
                    <Space align={'center'}>
                      <span>{(decode(token as string) as UserInfo)?.authorityId}</span>
                      <UserOutlined style={{ fontSize: '16px' }} />
                    </Space>
                  </Link>
                </Dropdown>
              )}
              <LangSelector />
            </Space>
          </div>
        </Header>
        <Content className="p-6 overflow-auto bg-gray-50">
          <Suspense
            fallback={
              <Spin
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '50vh',
                }}
              />
            }
          >
            <Outlet />
          </Suspense>
        </Content>
      </AntdLayout>
    </AntdLayout>
  )
}

export default Layout
