import request from '@/utils/request'

export function groupList() {
  return request({
    url: '/auth/group',
    method: 'get'
  })
}

export function groupDelete(id) {
  return request({
    url: '/auth/group/' + id,
    method: 'delete'
  })
}

export function addGroup(params) {
  return request({
    url: '/auth/group',
    method: 'post',
    data: params
  })
}

export function editGroup(params) {
  return request({
    url: '/auth/group/' + params.id,
    method: 'put',
    data: params
  })
}
