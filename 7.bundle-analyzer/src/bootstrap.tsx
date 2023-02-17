import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { createRoot } from 'react-dom/client'
import App from '~/App'
import '~/libs/i18n'
import '~/styles/index.scss'

dayjs.locale('zh-cn')

if (process.env.ENABLE_MOCK === 'true') {
  const { worker } = await import('./mocks/setup')
  worker.start({
    onUnhandledRequest: 'bypass',
    waitUntilReady: true,
  })
}

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(<App />)
