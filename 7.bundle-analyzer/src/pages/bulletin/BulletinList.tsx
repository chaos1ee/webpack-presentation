import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { TableColumnsType } from 'antd'
import { Button, Card, Table } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Translation, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { Bulletin } from '~/features/bulletin'
import { BulletinModal, addBulletin, queries } from '~/features/bulletin'

const columns: TableColumnsType<Bulletin> = [
  {
    key: 'id',
    title: 'ID',
    dataIndex: 'ID',
    render(value: string) {
      return <Link to={`/bulletin/${value}`}>{value}</Link>
    },
  },
  {
    key: 'startTime',
    title: <Translation>{t => t('start_time')}</Translation>,
    dataIndex: ['Constraint', 'StartTime'],
    render(value: number) {
      return <>{dayjs.unix(value).format('YYYY-MM-DD hh:mm:ss')}</>
    },
  },
  {
    key: 'endTime',
    title: <Translation>{t => t('end_time')}</Translation>,
    dataIndex: ['Constraint', 'EndTime'],
    render(value: number) {
      return <>{dayjs.unix(value).format('YYYY-MM-DD hh:mm:ss')}</>
    },
  },
]

const BulletinList = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, size: 10 })

  const { data } = useQuery(queries.list(pagination))

  const queryClient = useQueryClient()

  const addMutation = useMutation(addBulletin, {
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: queries.list._def })
      setOpen(false)
    },
  })

  return (
    <>
      <Card
        title={t('nav:bulletin')}
        extra={
          <Button
            type="primary"
            onClick={() => {
              setOpen(true)
            }}
          >
            {t('add_bulletin')}
          </Button>
        }
      >
        <Table
          rowKey={'ID'}
          dataSource={data?.List}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            total: data?.Total,
            current: pagination?.page,
            pageSize: pagination?.size,
            onChange: async (currentPage, currentSize) => {
              setPagination({ page: currentPage, size: currentSize })
            },
          }}
        />
      </Card>
      <BulletinModal
        open={open}
        close={() => {
          setOpen(false)
        }}
        onSubmit={values => {
          addMutation.mutate(values)
        }}
      />
    </>
  )
}

export default BulletinList
