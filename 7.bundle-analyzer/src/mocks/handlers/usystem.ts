import { randFullName, randNumber, randText } from '@ngneat/falso'
import * as jose from 'jose'
import { rest } from 'msw'
import { SECRET } from '~/constants'
import type { Role } from '~/features/permission'
import { datetime, mockListResponse, mockResponse, randomArray } from '~/utils'

const handlers = [
  rest.get('/api/usystem/user/login', async (_, res, ctx) => {
    const token = await new jose.SignJWT({
      authorityId: 'hao.li',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('12h')
      .sign(SECRET)

    return res(
      ctx.json({
        msg: 'ok',
        data: { token },
      }),
    )
  }),
  rest.post('/api/usystem/user/check', _ => {
    return mockResponse({
      has_all: true,
    })
  }),
  rest.get('/api/usystem/role/all', (_, res, ctx) => {
    return res(
      ctx.json({
        msg: 'ok',
        data: randomArray({ min: 1, max: 10 }).map(() => ({
          id: randNumber(),
          name: randFullName(),
        })),
      }),
    )
  }),
  rest.get('/api/usystem/user/list', () => {
    return mockListResponse(() => ({
      id: randNumber(),
      name: randFullName(),
      ctime: datetime(),
      roles: randomArray({ min: 0, max: 4 }).map(() => randText()),
    }))
  }),
  rest.get('/api/usystem/role/list', () => {
    return mockListResponse(() => ({ id: randNumber(), name: randFullName(), ctime: datetime() }))
  }),
  rest.get('/api/usystem/user/allPermssions', () => {
    return mockResponse([
      {
        category: '用户管理',
        permissions: [
          {
            label: '用户列表',
            value: '100001',
            route: '/api/usystem/user/list',
            method: '',
          },
          {
            label: '添加用户',
            value: '100002',
            route: '/api/usystem/user/create',
            method: '',
          },
          {
            label: '修改用户',
            value: '100003',
            route: '/api/usystem/user/update',
            method: '',
          },
          {
            label: '删除用户',
            value: '100004',
            route: '/api/usystem/user/delete',
            method: '',
          },
        ],
      },
      {
        category: '角色管理',
        permissions: [
          {
            label: '角色列表',
            value: '200001',
            route: '/api/usystem/role/list',
            method: '',
          },
          {
            label: '添加角色',
            value: '200002',
            route: '/api/usystem/role/create',
            method: '',
          },
          {
            label: '修改角色',
            value: '200003',
            route: '/api/usystem/role/update',
            method: '',
          },
          {
            label: '删除角色',
            value: '200004',
            route: '/api/usystem/role/delete',
            method: '',
          },
          {
            label: '角色详情',
            value: '200005',
            route: '/api/usystem/role/info',
            method: '',
          },
          {
            label: '所有角色',
            value: '200006',
            route: '/api/usystem/role/all',
            method: '',
          },
        ],
      },
      {
        category: '项目Project',
        permissions: [
          {
            label: '项目列表',
            value: '3001',
            route: '/adminApi/project',
            method: '',
          },
          {
            label: '项目详细信息',
            value: '3002',
            route: '/adminApi/project/detail',
            method: '',
          },
          {
            label: '编辑项目',
            value: '3003',
            route: '/adminApi/project/edit',
            method: '',
          },
          {
            label: '项目清档',
            value: '3004',
            route: '/adminApi/project/clear',
            method: '',
          },
          {
            label: '获取项目简单列表',
            value: '3005',
            route: '/adminApi/project/simple',
            method: '',
          },
        ],
      },
      {
        category: '群组Group',
        permissions: [
          {
            label: '群组搜索',
            value: '4001',
            route: '/adminApi/group',
            method: '',
          },
          {
            label: '编辑群组',
            value: '4003',
            route: '/adminApi/group/edit',
            method: '',
          },
          {
            label: '删除群组',
            value: '4004',
            route: '/adminApi/project/delete',
            method: '',
          },
        ],
      },
      {
        category: '禁言Ban',
        permissions: [
          {
            label: '禁言列表',
            value: '5001',
            route: '/adminApi/banList',
            method: '',
          },
        ],
      },
      {
        category: '操作历史List',
        permissions: [
          {
            label: '操作列表',
            value: '6001',
            route: '/adminApi/modifyList',
            method: '',
          },
        ],
      },
    ])
  }),
  rest.get('/api/usystem/role/info', () => {
    return mockResponse<Role>({
      id: randNumber(),
      name: randFullName(),
      ctime: datetime(),
      permissions: ['100001', '100002', '100003', '6001'],
    })
  }),
]

export default handlers
