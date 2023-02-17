import type { QueryObserverBaseResult } from '@tanstack/react-query'
import type { TableColumnsType, TablePaginationConfig } from 'antd'
import { Modal, Space, Table, Tag, message } from 'antd'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { TooltipButton } from '~/components'
import type { UserListItem } from '~/features/permission'
import { deleteUser } from '~/features/permission/services'
import { usePermissions } from '~/hooks'

export interface UserListProps {
  dataSource?: UserListItem[]
  pagination?: false | TablePaginationConfig
  onUpdate?: (value: UserListItem) => void
  refetch?: QueryObserverBaseResult['refetch']
}

export const UserList: FC<UserListProps> = ({ dataSource, pagination, refetch, onUpdate }) => {
  const { t } = useTranslation()

  const { permissions } = usePermissions({
    updatable: '100003',
    deletable: '100004',
  })

  const columns: TableColumnsType<UserListItem> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('role'),
      dataIndex: 'roles',
      key: 'roles',
      render(value: string[]) {
        return (
          <>
            {(value || []).map((item: string) =>
              item === 'root' ? (
                <Tag key={item} color="#f50">
                  {item}
                </Tag>
              ) : (
                <Tag key={item} color="#ff5a00">
                  <Link to={`/permission/role/${item}`}>{item}</Link>
                </Tag>
              ),
            )}
          </>
        )
      },
    },
    {
      title: t('creation_time'),
      dataIndex: 'ctime',
      key: 'ctime',
      width: 200,
    },
    {
      title: t('action'),
      width: 130,
      align: 'center',
      render: (value: UserListItem) => (
        <Space>
          <TooltipButton
            size="small"
            type="link"
            disabled={!permissions?.updatable}
            onClick={() => {
              onUpdate?.(value)
            }}
          >
            {t('update')}
          </TooltipButton>
          <TooltipButton
            danger
            size="small"
            disabled={!permissions?.deletable}
            type="link"
            onClick={() => {
              Modal.confirm({
                title: t('permission:delete_user'),
                content: (
                  <div
                    dangerouslySetInnerHTML={{ __html: t('permission:delete_user_message', { name: value.name }) }}
                  />
                ),
                cancelText: t('cancel'),
                okText: t('confirm'),
                onOk: async () => {
                  try {
                    await deleteUser({ id: value.id, name: value.name })
                    message.success(t('permission:delete_user_successfully'))
                    await refetch?.()
                  } catch (_) {
                    message.error(t('permission:delete_user_failed'))
                  }
                },
              })
            }}
          >
            {t('delete')}
          </TooltipButton>
        </Space>
      ),
    },
  ]

  return <Table tableLayout="fixed" rowKey="id" dataSource={dataSource} columns={columns} pagination={pagination} />
}
