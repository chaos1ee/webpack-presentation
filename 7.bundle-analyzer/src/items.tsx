import { CloudServerOutlined, DashboardOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons'
import type { ItemType2 } from './layouts/NavBar'

const items: ItemType2[] = [
  {
    key: 'bulletin',
    i18nKey: 'bulletin',
    icon: <DashboardOutlined />,
    route: '/bulletin',
  },
  {
    key: 'mail',
    i18nKey: 'mail_management',
    icon: <MailOutlined />,
    children: [
      {
        key: 'mail_list',
        i18nKey: 'mail_list',
        route: '/mail',
      },
    ],
  },
  {
    key: 'server',
    i18nKey: 'server_management',
    icon: <CloudServerOutlined />,
    children: [
      {
        key: 'server_list',
        i18nKey: 'server',
        route: '/server',
      },
      {
        key: 'gate',
        i18nKey: 'gate',
        route: '/server/gate',
      },
      {
        key: 'version',
        i18nKey: 'version',
        route: '/server/version',
      },
      {
        key: 'manifest',
        i18nKey: 'Manifest',
        route: '/server/manifest',
      },
      {
        key: 'data',
        i18nKey: 'data_service',
        route: '/server/data',
      },
    ],
  },
  {
    key: 'permission',
    i18nKey: 'permission_management',
    icon: <SafetyOutlined />,
    children: [
      {
        key: 'user_list',
        i18nKey: 'user',
        route: '/permission/user',
      },
      {
        key: 'role_list',
        i18nKey: 'role',
        route: '/permission/role',
      },
    ],
  },
]

export default items
