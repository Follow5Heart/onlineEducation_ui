import request from '@/utils/request'

export function getNextedTreeList() {
  return request({
    url: '/admin/edu/subject/nextedSubject',
    method: 'get'
  })
}

export function getCurrentSubjectList(parentId) {
  return request({
    url: '/admin/edu/subject/getCurrentSubjectList',
    method: 'get',
    params: parentId
  })
}
