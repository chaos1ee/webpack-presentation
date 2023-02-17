import { Checkbox, Collapse, Skeleton, Typography } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAllPermissions } from '../hooks'

const { Panel } = Collapse
const { Text } = Typography

export const PermissionList = ({
  expand = true,
  value,
  readonly,
  onChange,
}: {
  expand?: boolean
  value?: CheckboxValueType[]
  readonly?: boolean
  onChange?: (checkedValue: CheckboxValueType[]) => void
}) => {
  const { t } = useTranslation()
  const [activeKey, setActiveKey] = useState<string[]>([])
  const [internalValue, setInternalValue] = useState<CheckboxValueType[]>(value ?? [])
  const { permissions, isLoading, isError } = useAllPermissions()

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setInternalValue(value ?? [])
  }, [value])

  useEffect(() => {
    if (expand) {
      setActiveKey((permissions ?? []).map(({ category }) => category))
    }
  }, [expand, permissions])

  useEffect(() => {
    const checkedValue = (permissions ?? []).reduce((acc, curr) => {
      acc[curr.category] = curr.permissions.every(item => internalValue.includes(item.value))
      return acc
    }, {} as Record<string, boolean>)

    setCheckedMap(checkedValue)
  }, [internalValue, permissions])

  const onCollapseChange = (key: string | string[]) => {
    setActiveKey(key as string[])
  }

  const getCheckedValue = (checkedValue: boolean, codes: string[]) => {
    let tempValue: CheckboxValueType[] = []

    if (checkedValue) {
      tempValue = [...new Set(internalValue.concat(codes))]
    } else {
      tempValue = internalValue.slice()

      codes.forEach(code => {
        const index = tempValue.findIndex(item => item === code)
        if (index > -1) {
          tempValue.splice(index, 1)
        }
      })
    }

    return tempValue
  }

  const onCheckChange = (e: CheckboxChangeEvent, category: string, codes: string[]) => {
    const checkedValue = getCheckedValue(e.target.checked, codes)
    setInternalValue(checkedValue)
    onChange?.(checkedValue)
  }

  if (isError) {
    return (
      <div className="flex justify-center">
        <Text type="danger">{t('fetcing_permissions_failed')}</Text>
      </div>
    )
  }

  return (
    <Skeleton active loading={isLoading}>
      <Collapse style={{ width: '100%' }} collapsible="header" activeKey={activeKey} onChange={onCollapseChange}>
        {(permissions ?? []).map(item => (
          <Panel
            header={item.category}
            key={item.category}
            extra={
              !readonly && (
                <Checkbox
                  checked={checkedMap[item.category]}
                  onChange={e => {
                    onCheckChange(
                      e,
                      item.category,
                      item.permissions.map(permission => permission.value),
                    )
                  }}
                >
                  {t('select_all')}
                </Checkbox>
              )
            }
          >
            <Checkbox.Group
              style={{ width: '100%' }}
              options={item.permissions.map(permission => ({
                label: permission.label,
                value: permission.value,
                disabled: readonly,
                onChange(e) {
                  onCheckChange(e, item.category, [permission.value])
                },
              }))}
              value={internalValue}
            />
          </Panel>
        ))}
      </Collapse>
    </Skeleton>
  )
}
