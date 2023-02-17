import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Empty, Form, Input, Modal, Table, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { VersionType } from '~/features/server'
import { addVersion, getCurrentVersion, getVersionList, setVersion } from '~/features/server'

const { Text } = Typography

const Version = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dataSource, setDataSource] = useState<VersionType[]>([])
  const [currentVersion, setCurrentVersion] = useState('-')

  const columns: ColumnsType<VersionType> = [
    {
      key: 'version',
      title: t('version'),
      dataIndex: 'Version',
    },
    {
      key: 'info',
      title: t('upgrade_info'),
      dataIndex: 'UpgradeInfo',
    },
    {
      key: 'action',
      title: t('action'),
      align: 'center',
      width: 80,
      render(value: VersionType) {
        const onClick = () => {
          Modal.confirm({
            icon: null,
            content: (
              <div dangerouslySetInnerHTML={{ __html: t('set_current_version_message', { id: value.Version }) }}></div>
            ),
            async onOk() {
              try {
                await setVersion(value.Version)
                await fetchList()
                setCurrentVersion(value.Version)
                message.success(t('set_current_version_successfully'))
              } catch (_) {
                message.error(t('set_current_version_failed'))
              }
            },
          })
        }

        return (
          <Button danger type="link" onClick={onClick}>
            {t('set_current_version')}
          </Button>
        )
      },
    },
  ]

  const fetchList = async () => {
    try {
      const { List } = await getVersionList()
      setDataSource(List)
    } catch (_) {
      setDataSource([])
    }
  }

  useEffect(() => {
    fetchList()
    getCurrentVersion().then(res => {
      setCurrentVersion(res || '-')
    })
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
    version: string
    items: {
      prop: string
      url: string
      size: number
      md5: string
      fromVer: string
    }[]
  }) => {
    setConfirmLoading(true)

    try {
      const payload = {
        Version: values.version,
        UpgradeInfo: (values.items ?? []).reduce(
          (acc, curr) => {
            acc[curr.prop] = {
              URL: curr.url,
              Size: curr.size,
              MD5: curr.md5,
              FromVer: curr.fromVer,
            }
            return acc
          },
          {} as Record<
            string,
            {
              URL: string
              Size: number
              MD5: string
              FromVer: string
            }
          >,
        ),
      }
      await addVersion(payload)
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
            {t('add_version')}
          </Button>
        }
        extra={<Text strong>{t('current_version', { version: currentVersion })}</Text>}
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
        title={t('add_version')}
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
          <Form.Item name="version" label={t('version')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Text strong>{t('upgrade_info')}</Text>
          <Divider dashed />
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key} className={'flex items-center'}>
                    <div className={'flex-1'}>
                      <Form.Item name={[field.name, 'prop']} label={t('prop')} rules={rules}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'url']} label={t('url')} rules={rules}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'size']} label={t('size')} rules={rules}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'md5']} label="MD5" rules={rules}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'fromVer']} label="FromVer" rules={rules}>
                        <Input />
                      </Form.Item>
                      {index !== fields.length - 1 && (
                        <Form.Item>
                          <Divider />
                        </Form.Item>
                      )}
                    </div>
                    <MinusCircleOutlined style={{ flex: '0 40px' }} onClick={() => remove(field.name)} />
                  </div>
                ))}
                {fields.length === 0 && <Empty />}
                <Divider dashed />
                <Form.Item>
                  <Button block type="dashed" size="small" icon={<PlusOutlined />} onClick={() => add()}>
                    {t('add')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  )
}

export default Version
