import request from '@/utils/request'

export function saveChapter(chapterInfo) {
  return request({
    url: '/service-edu/admin/edu/chapter/saveChapter',
    method: 'post',
    data: chapterInfo
  })
}

export function getChapter(chapterId) {
  return request({
    url: `/service-edu/admin/edu/chapter/getChapter/${chapterId}`,
    method: 'get'
  })
}

export function updateChapter(chapterInfo) {
  return request({
    url: '/service-edu/admin/edu/chapter/updateChapter',
    method: 'put',
    data: chapterInfo
  })
}

export function deleteChapter(chapterId) {
  return request({
    url: `/service-edu/admin/edu/chapter/deleteChapter/${chapterId}`,
    method: 'delete'
  })
}

export function getNestedList(courseId) {
  return request({
    url: `/service-edu/admin/edu/chapter/getNestedList/${courseId}`,
    method: 'get'
  })
}

