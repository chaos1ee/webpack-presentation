import { Button, Card, Descriptions, Form, Input, Modal, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getManifest, updateManifest } from '~/features/server'

const { Item } = Form

interface FormModel {
  cdnUrl: string
  optUrl: string
  appUrl: string
}

const Manifest = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dataSource, setDataSource] = useState<FormModel>({
    cdnUrl: '',
    optUrl: '',
    appUrl: '',
  })

  useEffect(() => {
    getManifest()
      .then(res => {
        setDataSource({
          cdnUrl: res.CDN,
          optUrl: res.OptURL,
          appUrl: res.AppDownloadURL,
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
      await updateManifest({
        CDN: values.cdnUrl,
        OptURL: values.optUrl,
        AppDownloadURL: values.appUrl,
      })
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
            {t('update_manifest')}
          </Button>
        }
      >
        <Skeleton active loading={loading}>
          <Descriptions column={2}>
            <Descriptions.Item label={t('cdn_address')}>{dataSource.cdnUrl}</Descriptions.Item>
            <Descriptions.Item label="OptURL">{dataSource.optUrl}</Descriptions.Item>
            <Descriptions.Item label={t('app_download_address')}>{dataSource.appUrl}</Descriptions.Item>
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
        title={t('update_manifest')}
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
          <Item name="cdnUrl" label={t('cdn_address')} rules={[{ required: true }]}>
            <Input />
          </Item>
          <Item name="optUrl" label="OptUrl" rules={[{ required: true }]}>
            <Input />
          </Item>
          <Item name="appUrl" label={t('app_download_address')} rules={[{ required: true }]}>
            <Input />
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default Manifest
