import request from '@/utils/request'

export function fetchRule() {
  return request({
    url: '/auth/rule',
    method: 'get'
  })
}

export function addRule(params) {
  return request({
    url: '/auth/rule',
    method: 'post',
    data: params
  })
}

export function updateRule(id, data) {
  return request({
    url: '/auth/rule/' + id,
    method: 'put',
    data
  })
}

export function deleteRule(params) {
  return request({
    url: '/auth/rule/' + params.id,
    method: 'delete'
  })
}

export function fetchTree() {
  return request({
    url: '/auth/tree',
    method: 'get'
  })
}
