import { UsergroupAddOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import type { TableColumnsType } from 'antd'
import { App, Card, Space, Table, message } from 'antd'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { NoPermissionCover, TooltipButton } from '~/components'
import type { RoleFormModel, RoleListItem } from '~/features/permission'
import { RoleModal, deleteRole, getRoleInfo, getRoleList } from '~/features/permission'
import { usePermissions } from '~/hooks'

const Role = () => {
  const { t } = useTranslation()
  const [currentRole, setCurrentRole] = useState<RoleFormModel | null>(null)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const { modal } = App.useApp()

  const { permissions, isLoading: isChecking } = usePermissions({
    listable: '200001',
    creatable: '200002',
    updatable: '200003',
    deletable: '200004',
    viewable: '200005',
  })

  const pagination = useRef<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: 10,
  })

  const { data, refetch } = useQuery({
    queryKey: ['list', pagination.current.page, pagination.current.pageSize],
    queryFn: () => getRoleList({ page: pagination.current.page, pageSize: pagination.current.pageSize }),
    enabled: !!permissions?.listable,
  })

  const columns: TableColumnsType<RoleListItem> = [
    {
      title: t('name'),
      key: 'name',
      render(value: RoleListItem) {
        if (permissions?.viewable) {
          return <Link to={`${value.name}`}>{value.name}</Link>
        } else {
          return <>{value.name}</>
        }
      },
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('creation_time'),
      dataIndex: 'ctime',
      key: 'ctime',
      width: 200,
    },
    {
      title: t('action'),
      width: 150,
      align: 'center',
      render: (value: RoleListItem) => {
        return (
          <Space size="small">
            <TooltipButton
              loading={isChecking}
              size="small"
              type="link"
              disabled={!permissions?.updatable}
              onClick={async () => {
                setIsUpdate(true)
                try {
                  const res = await getRoleInfo({ name: value.name })
                  setCurrentRole({
                    id: res.id,
                    permissions: res.permissions,
                    name: value.name.replace(/^role_/, ''),
                  })
                  setIsModelOpen(true)
                } catch (_) {
                  setCurrentRole(null)
                }
              }}
            >
              {t('update')}
            </TooltipButton>
            <TooltipButton
              danger
              loading={isChecking}
              size="small"
              type="link"
              disabled={!permissions?.deletable}
              onClick={() => {
                modal.confirm({
                  title: t('permission:delete_role'),
                  content: (
                    <div
                      dangerouslySetInnerHTML={{ __html: t('permission:delete_role_message', { name: value.name }) }}
                    />
                  ),
                  cancelText: t('cancel'),
                  okText: t('confirm'),
                  onOk: async () => {
                    try {
                      await deleteRole({ id: value.id, name: value.name })
                      message.success(t('permission:delete_role_successfully'))
                      await refetch()
                    } catch (_) {
                      message.error(t('permission:delete_role_failed'))
                    }
                  },
                })
              }}
            >
              {t('delete')}
            </TooltipButton>
          </Space>
        )
      },
    },
  ]

  return (
    <>
      <Card
        title={t('nav:role')}
        extra={
          <TooltipButton
            type="primary"
            disabled={!permissions?.creatable}
            loading={isChecking}
            icon={<UsergroupAddOutlined />}
            onClick={() => {
              setCurrentRole(null)
              setIsModelOpen(true)
            }}
          >
            {t('permission:create_role')}
          </TooltipButton>
        }
      >
        {!isChecking &&
          (permissions?.listable ? (
            <Table
              tableLayout="fixed"
              rowKey="name"
              dataSource={data?.List}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total: data?.Total,
                current: pagination.current.page,
                pageSize: pagination.current.pageSize,
                onChange: (currentPage, currentSize) => {
                  pagination.current = {
                    page: currentPage,
                    pageSize: currentSize,
                  }
                },
              }}
            />
          ) : (
            <NoPermissionCover />
          ))}
      </Card>
      <RoleModal
        isUpdate={isUpdate}
        open={isModelOpen}
        value={currentRole}
        close={() => {
          setIsModelOpen(false)
          setCurrentRole(null)
          setIsUpdate(false)
        }}
        onChange={refetch}
      />
    </>
  )
}

export default Role
