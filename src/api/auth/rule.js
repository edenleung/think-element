import request from '@/utils/request'

export function ruleList() {
  return request({
    url: '/auth/rule',
    method: 'get'
  })
}

export function ruleDelete(id) {
  return request({
    url: '/auth/rule/' + id,
    method: 'delete'
  })
}

export function addRule(params) {
  return request({
    url: '/auth/rule',
    method: 'post',
    data: params
  })
}

export function editRule(params) {
  return request({
    url: '/auth/rule/' + params.id,
    method: 'put',
    data: params
  })
}
