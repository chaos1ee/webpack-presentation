import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Modal, Switch, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Gate } from '~/features/server'
import { addGate, deleteGate, getGateList } from '~/features/server'
import { PURE_NUMBER } from '~/rules'

const { Item } = Form

const GateList = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dataSource, setDataSource] = useState<Gate[]>([])

  const columns: ColumnsType<Gate> = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'ID',
    },
    {
      key: 'address',
      title: t('address'),
      dataIndex: 'Addr',
    },
    {
      key: 'open',
      title: t('whether_to_open'),
      dataIndex: 'Open',
      render(value: boolean) {
        return <>{value ? t('yes') : t('no')}</>
      },
    },
    {
      key: 'action',
      title: t('action'),
      align: 'center',
      width: 80,
      render(value: Gate) {
        const onClick = () => {
          Modal.confirm({
            icon: null,
            content: <div dangerouslySetInnerHTML={{ __html: t('delete_gate_message', { id: value.ID }) }}></div>,
            async onOk() {
              try {
                await deleteGate(value.Addr)
                await fetchList()
                message.success(t('gate_deleted_successfully'))
              } catch (_) {
                message.error(t('gate_deleted_failed'))
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
      const { List } = await getGateList()
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

  const onFinish = async (values: { id: number; address: string; open: boolean }) => {
    setConfirmLoading(true)

    try {
      await addGate({
        ID: +values.id,
        Addr: values.address,
        Open: values.open,
      })
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
            {t('add_gate')}
          </Button>
        }
      >
        <Table pagination={false} dataSource={dataSource} rowKey="ID" columns={columns}></Table>
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
        title={t('add_gate')}
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
          initialValues={{ open: true }}
          onFinish={onFinish}
        >
          <Item name="id" label="ID" rules={[{ required: true }, PURE_NUMBER]}>
            <Input />
          </Item>
          <Item name="address" label={t('address')} rules={rules}>
            <Input />
          </Item>
          <Item name="open" label={t('whether_to_open')} valuePropName="checked">
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default GateList
