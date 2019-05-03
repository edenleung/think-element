import request from '@/utils/request'

export function fetchRole() {
  return request({
    url: '/auth/role',
    method: 'get'
  })
}

export function addRole(params) {
  return request({
    url: '/auth/role',
    method: 'post',
    data: params
  })
}

export function updateRole(id, params) {
  return request({
    url: '/auth/role/' + id,
    method: 'put',
    data: params
  })
}

export function deleteRole(params) {
  return request({
    url: '/auth/role/' + params.id,
    method: 'delete'
  })
}
