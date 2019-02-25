import request from '@/utils/request'

export function saveUser(params) {
  return request({
    url: '/auth/user',
    method: 'post',
    data: params
  })
}
