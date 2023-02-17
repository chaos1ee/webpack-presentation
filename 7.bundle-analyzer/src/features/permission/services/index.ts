import { request } from '~/libs/request'

export interface PermissionEnumItem {
  category: string
  permissions: {
    label: string
    value: string
    route: string
  }[]
}

export interface RoleEnumItem {
  id: string
  name: string
}

export interface RoleListItem {
  id: number
  name: string
  ctime: string
}

export interface Role {
  id: number
  name: string
  ctime: string
  permissions: string[]
}

export interface UserListItem {
  id: string
  name: string
  ctime: string
  roles: string[]
}

export function getPermissionEnum() {
  return request.get<PermissionEnumItem[]>('/usystem/user/allPermssions')
}

export function getRoleEnum() {
  return request.get<RoleEnumItem[]>('/usystem/role/all')
}

export function getRoleList({ page, pageSize }: { page?: number; pageSize?: number }) {
  return request.get<ListResponse<RoleListItem>>('/usystem/role/list', { params: { page, pageSize } })
}

export function getRoleInfo({ name }: { name: string }) {
  return request.get<Role>('/usystem/role/info', { params: { name } })
}

export function createRole({ name, permissions }: { name: string; permissions: string[] }) {
  return request.post('/usystem/role/create', { name, permissions })
}

export function updateRole({ id, name, permissions }: { id: number; name: string; permissions: string[] }) {
  return request.post('/usystem/role/update', { id, name, permissions })
}

export function deleteRole({ id, name }: { id: number; name: string }) {
  return request.post('/usystem/role/delete', { id, name })
}

export function getUserList(pagination?: PaginationParams) {
  return request.get<ListResponse<UserListItem>>('/usystem/user/list', { params: { ...pagination } })
}

export function createUser({ name, roles }: { name: string; roles: string[] }) {
  return request.post('/usystem/user/create', { name, roles })
}

export function updateUser({ id, name, roles }: { id: string; name: string; roles: string[] }) {
  return request.post('/usystem/user/update', { id, name, roles })
}

export function deleteUser({ id, name }: { id: string; name: string }) {
  return request.post('/usystem/user/delete', { id, name })
}
