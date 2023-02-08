import request from '@/utils/request'

export function getNextedTreeList() {
  return request({
    url: '/admin/edu/subject/nextedSubject',
    method: 'get'
  })
}
