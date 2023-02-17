import { Menu } from 'antd'
import type {
  ItemType,
  MenuDividerType,
  MenuItemGroupType,
  MenuItemType,
  SubMenuType,
} from 'antd/es/menu/hooks/useItems'
import type { ComponentType, FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Translation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import type { Merge } from 'ts-essentials'
import { OPEN_KEYS, SELECTED_KEYS } from '~/constants'
import { parseJsonStr } from '~/utils'

// 扩展 antd Menu 的类型，使其支持一些我们想要的自定义字段。
type MenuItemType2 = Merge<
  Omit<MenuItemType, 'label'>,
  {
    code /** 权限编号 **/?: string
    route /** 前端路由地址 **/?: string
    i18nKey?: string
  }
>

type SubMenuType2 = Merge<Omit<SubMenuType, 'label'>, { children?: ItemType2[]; i18nKey?: string }>

type MenuItemGroupType2 = Merge<Omit<MenuItemGroupType, 'label'>, { children?: ItemType2[]; i18nKey?: string }>

export type ItemType2 = MenuItemType2 | SubMenuType2 | MenuItemGroupType2 | MenuDividerType | null

const withLink = <P extends object>(Component: ComponentType<P>, route?: string) => {
  const ComponentWithLink = (props: P) => {
    if (route) {
      return (
        <Link to={route}>
          <Component {...(props as P)} />
        </Link>
      )
    }

    return <Component {...(props as P)} />
  }

  return ComponentWithLink
}

/**
 * 转换导航配置，主要做了以下几件事情
 * 1. 翻译 i18nKey
 * 2. 用 Link 元素包装 route
 * 3. 收集 code，用于权限判断（未支持）
 */
function transformItems(items: ItemType2[]) {
  const result: ItemType[] = []

  for (let i = 0; i < items.length; i++) {
    if (items[i] === null) {
      result[i] = null
    } else if ((items[i] as MenuDividerType).type === 'divider') {
      result[i] = { ...items[i] } as MenuDividerType
    } else {
      const { i18nKey, ...others } = items[i] as Exclude<ItemType2, MenuDividerType | null>
      // 翻译
      const Label = () => <Translation>{t => <>{t(`nav:${i18nKey}`)}</>}</Translation>

      if ((others as Omit<SubMenuType2 | MenuItemGroupType2, 'i18nKey'>).children) {
        const { children, ...restProps } = others as Omit<SubMenuType2 | MenuItemGroupType2, 'i18nKey'>
        result[i] = { ...restProps, label: <Label />, children: transformItems(children ?? []) } as
          | SubMenuType
          | MenuItemGroupType
      } else {
        // TODO: 收集权限 code
        const { code, route, ...restProps } = others as Omit<MenuItemType2, 'i18nKey'>
        const LabelWithLink = withLink(Label, route)
        result[i] = { ...restProps, label: <LabelWithLink /> } as MenuItemType
      }
    }
  }

  return result
}

// 拍平导航配置，并且注入 keypath 字段
function flatItems(
  items: ItemType2[],
  result: Merge<MenuItemType2, { keypath?: string[] }>[] = [],
  keypath: string[] = [],
) {
  for (const item of items) {
    const children = (item as SubMenuType2 | MenuItemGroupType2)!.children as ItemType2[]

    if (Array.isArray(children)) {
      const _keys =
        (item as MenuItemGroupType2)!.type !== 'group' && item!.key ? [...keypath, item!.key as string] : keypath
      flatItems(children, result, _keys)
    } else {
      result.push(Object.assign(item as MenuItemType2, { keypath }))
    }
  }

  return result
}

export interface NavBarProps {
  items?: ItemType2[]
}

const NavBar: FC<NavBarProps> = ({ items }) => {
  const location = useLocation()
  const internalItems = useMemo(() => transformItems(items ?? []), [items])
  const flattenItems = useMemo(() => flatItems(items ?? []), [items])
  const [openKeys, setOpenKeys] = useState<string[]>(parseJsonStr(localStorage.getItem(OPEN_KEYS) as string, []))
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    parseJsonStr(localStorage.getItem(SELECTED_KEYS) as string, []),
  )

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
    const match = flattenItems.find(item => latestOpenKey === item.key)
    const _openKeys = (match?.keypath ?? [latestOpenKey]) as string[]
    setOpenKeys(_openKeys)
    localStorage.setItem(OPEN_KEYS, JSON.stringify(_openKeys))
  }

  useEffect(() => {
    const match = flattenItems.find(item => location.pathname === item.route)

    if (match) {
      const key = match.key as string
      const keypath = match.keypath as string[]
      setSelectedKeys([key])
      localStorage.setItem(SELECTED_KEYS, JSON.stringify([key]))
      setOpenKeys(keypath)
      localStorage.setItem(OPEN_KEYS, JSON.stringify(keypath))
    }
  }, [flattenItems, location])

  return (
    <Menu
      style={{ borderRight: 'none' }}
      items={internalItems}
      mode={'inline'}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={onOpenChange}
    />
  )
}

export default NavBar
