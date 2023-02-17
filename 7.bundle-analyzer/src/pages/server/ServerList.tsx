import { Button, Card, DatePicker, Form, Input, message, Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import dayjs from 'dayjs'
import { PURE_NUMBER } from '~/rules'
import type { Server } from '../../features/server/services'
import { addServer, deleteServer, getServerList } from '../../features/server/services'

const { Item } = Form
const { RangePicker } = DatePicker

const ServerList = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dataSource, setDataSource] = useState<Server[]>([])

  const columns: ColumnsType<Server> = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'ID',
    },
    {
      key: 'name',
      title: t('name'),
      dataIndex: 'Name',
    },
    {
      key: 'address',
      title: t('address'),
      dataIndex: 'Addr',
    },
    {
      key: 'channel',
      title: t('channel'),
      dataIndex: 'Channel',
    },
    {
      key: 'hash',
      title: 'NameHash',
      dataIndex: 'NameHash',
    },
    {
      key: 'status',
      title: t('status'),
      dataIndex: 'Status',
    },
    {
      key: 'priority',
      title: t('priority'),
      dataIndex: 'Priority',
    },
    {
      key: 'action',
      title: t('action'),
      align: 'center',
      width: 80,
      render(value: Server) {
        const onClick = () => {
          Modal.confirm({
            icon: null,
            content: <div dangerouslySetInnerHTML={{ __html: t('delete_server_message', { id: value.ID }) }}></div>,
            async onOk() {
              try {
                await deleteServer(value.Name)
                message.success(t('server_deleted_successfully'))
              } catch (_) {
                message.error(t('server_deleted_failed'))
              }
            },
          })
        }

        return (
          <Button danger type="link" onClick={onClick}>
            {t('delete')}
          </Button>
        )
      },
    },
  ]

  const fetchList = async () => {
    try {
      const { List } = await getServerList()
      setDataSource(List)
    } catch (_) {
      setDataSource([])
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = async (values: {
    name: string
    displayName: string
    id: number
    address: string
    nameHash: string
    priority: number
    channel: string
    openTime: number
    maintainingStartTime: number
    maintainingEndTime: number
  }) => {
    setConfirmLoading(true)

    try {
      const payload = {
        Name: values.name,
        Addr: values.address,
        DisplayName: values.displayName,
        ID: +values.id,
        NameHash: +values.nameHash,
        Priority: +values.priority,
        Channel: values.channel,
        OpenTime: values.openTime && dayjs(values.openTime).unix(),
        MaintainInfo: {
          MaintainingStartTime: values.maintainingStartTime && dayjs(values.maintainingStartTime).unix(),
          MaintainingEndTime: values.maintainingEndTime && dayjs(values.maintainingEndTime).unix(),
        },
      }
      await addServer(payload)
      await fetchList()
      setIsModalOpen(false)
    } finally {
      setConfirmLoading(false)
    }
  }

  const rules = [
    {
      type: 'string' as const,
      required: true,
    },
  ]

  return (
    <>
      <Card
        title={
          <Button
            type="primary"
            onClick={() => {
              showModal()
            }}
          >
            {t('add_server')}
          </Button>
        }
      >
        <Table pagination={false} dataSource={dataSource} rowKey="Name" columns={columns}></Table>
      </Card>
      <Modal
        destroyOnClose
        width={600}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {t('cancel')}
          </Button>,
          <Button form="form" key="submit" type="primary" loading={confirmLoading} htmlType="submit">
            {t('confirm')}
          </Button>,
        ]}
        title={t('add_server')}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          labelWrap
          preserve={false}
          labelCol={{ flex: '110px' }}
          labelAlign="right"
          id="form"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Item name="name" label={t('name')} rules={rules}>
            <Input />
          </Item>
          <Item name="displayName" label={t('display_name')} rules={rules}>
            <Input />
          </Item>
          <Item name="id" label="ID" rules={[{ required: true }, PURE_NUMBER]}>
            <Input />
          </Item>
          <Item name="address" label={t('address')} rules={rules}>
            <Input />
          </Item>
          <Item name="nameHash" label="NameHash" rules={[{ required: true }, PURE_NUMBER]}>
            <Input />
          </Item>
          <Item name="priority" label={t('priority')} rules={[{ required: true }, PURE_NUMBER]}>
            <Input />
          </Item>
          <Item name="channel" label={t('channel')} rules={rules}>
            <Input />
          </Item>
          <Item
            name="openTime"
            label={t('server_open_time')}
            rules={[
              {
                type: 'object' as const,
                required: false,
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Item>
          <Item
            name="maintainingStartTime"
            label={t('server_maintaining_time')}
            rules={[
              {
                type: 'array' as const,
                required: false,
              },
            ]}
          >
            <RangePicker showTime allowEmpty={[true, true]} format="YYYY-MM-DD HH:mm:ss" />
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default ServerList
