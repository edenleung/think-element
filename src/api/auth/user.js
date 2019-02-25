import request from '@/utils/request'

export function getUserList() {
  return request({
    url: '/auth/user',
    method: 'get'
  })
}

export function addUser(params) {
  return request({
    url: '/auth/user',
    method: 'post',
    data: params
  })
}

export function saveUser(params) {
  return request({
    url: '/auth/user/' + params.admin_id,
    method: 'put',
    data: params
  })
}

export function deleteUser(id) {
  return request({
    url: '/auth/user/' + id,
    method: 'delete'
  })
}
