import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntdApp, ConfigProvider, Spin } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RouterProvider } from 'react-router-dom'
import router from '~/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const App = () => {
  const { i18n } = useTranslation()
  const [locale, setLocale] = useState(zhCN)

  const handleLanguageChange = (lang: string) => {
    switch (lang) {
      case 'zh_CN':
        setLocale(zhCN)
        break
      default:
        setLocale(enUS)
    }
  }

  useEffect(() => {
    handleLanguageChange(i18n.language)

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={locale}
        theme={{
          token: {
            colorPrimary: '#ff5a00',
            colorLink: '#ff5a00',
            colorLinkHover: '#ff927b',
            colorBorder: 'rgba(5, 5, 5, 0.06)',
          },
        }}
      >
        <AntdApp>
          <RouterProvider
            router={router}
            fallbackElement={
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
          />
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
