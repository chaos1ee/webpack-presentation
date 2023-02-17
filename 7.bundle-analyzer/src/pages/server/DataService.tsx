import { Button, Card, Descriptions, Form, Input, Modal, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDataAddress, updateDataAddress } from '~/features/server'

const { Item } = Form

interface FormModel {
  address: string
}

const DataService = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm<FormModel>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dataSource, setDataSource] = useState<FormModel>({
    address: '',
  })

  useEffect(() => {
    getDataAddress()
      .then(res => {
        setDataSource({
          address: res,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const showModal = () => {
    setIsModalOpen(true)
    form.setFieldsValue(dataSource)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = async (values: FormModel) => {
    setConfirmLoading(true)
    try {
      await updateDataAddress(values.address)
      setDataSource(values)
      setIsModalOpen(false)
    } finally {
      setConfirmLoading(false)
    }
  }

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
            {t('update_data_service_address')}
          </Button>
        }
      >
        <Skeleton active loading={loading}>
          <Descriptions column={2}>
            <Descriptions.Item label={t('cdn_address')}>{dataSource.address}</Descriptions.Item>
          </Descriptions>
        </Skeleton>
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
        title={t('update_data_service_address')}
        open={isModalOpen}
        getContainer={false}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          labelWrap
          form={form}
          preserve={false}
          labelCol={{ flex: '120px' }}
          labelAlign="right"
          id="form"
          autoComplete="off"
          initialValues={{ open: true }}
          onFinish={onFinish}
        >
          <Item name="address" label={t('data_service_address')} rules={[{ required: true }]}>
            <Input />
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default DataService
