import { AliyunOutlined, LoginOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Row, Spin, Typography } from 'antd'
import type { FC } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

import loginBg from '../assets/login.svg'

import { useTranslation } from 'react-i18next'
import { LangSelector } from '~/components'
import { SSO_URL } from '~/constants'
import { useToken } from '~/hooks'

const { Title } = Typography

const Login: FC = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { token, isLoading } = useToken(searchParams.get('ticket'))

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

  if (token) {
    // TODO: 自动导航到路由上注册的第一个路径
    return <Navigate replace to="/bulletin" />
  }

  return (
    <div>
      <Row className={'h-screen'}>
        <Col span={10} offset={3}>
          <img className={'w-full h-full -mt-10'} src={loginBg} alt="login bg" />
        </Col>
        <Col span={5} offset={3}>
          <div className={'h-full flex items-center'}>
            <div className={'w-96 shadow-lg rounded-md'}>
              <div className={'flex items-center flex-col p-6'}>
                <div className={'w-full'}>
                  <div className={'text-center mb-6'}>
                    <Title level={5}>{t('login_method')}</Title>
                  </div>
                  <Form layout={'vertical'} autoComplete="off">
                    <Form.Item label={t('username')} name={'username'} rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item label={t('password')} name={'password'} rules={[{ required: true }]}>
                      <Input type={'password'} />
                    </Form.Item>
                    <Form.Item>
                      <div className={'flex justify-center'}>
                        <Button type={'primary'} htmlType={'submit'} icon={<LoginOutlined />}>
                          {t('login')}
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
                <Divider plain>{t('third_party_login')}</Divider>
                <Button
                  type={'link'}
                  size={'small'}
                  shape="round"
                  icon={<AliyunOutlined />}
                  href={`${SSO_URL}/login?service=${encodeURIComponent(window.location.origin)}/login`}
                  target={'_self'}
                >
                  {t('sign_in_idaas')}
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div className={'fixed top-8 right-8'}>
        <LangSelector />
      </div>
    </div>
  )
}

export default Login
