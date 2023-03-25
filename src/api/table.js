import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/service-edu/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
