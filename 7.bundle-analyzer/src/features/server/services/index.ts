import { request } from '~/libs/request'

export interface VersionType {
  Version: string
  UpgradeInfo: Record<
    string,
    {
      URL: string
      Size: number
      MD5: string
      FromVer: string
    }
  >
}

export interface Manifest {
  CDN: string
  OptURL: string
  AppDownloadURL: string
}

export interface Server {
  Name: string
  Addr: string
  DisplayName: string
  ID: number
  OpenTime: number
  NameHash: number
  MaintainInfo?: {
    MaintainingStartTime?: number
    MaintainingEndTime?: number
  }
  Priority: number
  Channel: string
}

export interface Gate {
  ID: number
  Addr: string
  Open: boolean
}

export function getVersionList() {
  return request.get<ListResponse<VersionType>>('/conf/version/index')
}

export function addVersion(data: VersionType) {
  return request.post('/conf/version/add', { Version: data })
}

export function setVersion(version: string) {
  return request.post('/conf/version/setcurrent', { Version: version })
}

export function getCurrentVersion() {
  return request.get<string>('/conf/version/getcurrent')
}

export function getManifest() {
  return request.get<Manifest>('/conf/version/manifest')
}

export function updateManifest(data: Manifest) {
  return request.post('/conf/version/manifest', data)
}

export function getDataAddress() {
  return request.get<string>('/conf/game/addr')
}

export function updateDataAddress(address: string) {
  return request.post('/conf/game/addr', { addr: address })
}

export function getServerList() {
  return request.get<ListResponse<Server>>('/server/kingdom/index')
}

export function addServer(data: Server) {
  return request.post('/server/kingdom/add', { Config: data })
}

export function deleteServer(name: string) {
  return request.post('/server/kingdom/remove', { Name: name })
}

export function getGateList() {
  return request.get<ListResponse<Gate>>('/server/gate/index')
}

export function addGate(data: Gate) {
  return request.post('/server/gate/add', { Config: data })
}

export function deleteGate(address: string) {
  return request.post('/server/gate/remove', { Addr: address })
}
