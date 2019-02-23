import request from '@/utils/request'

export function saveUser(params) {
  return request({
    url: '/auth/rule',
    method: 'post',
    data: params
  })
}