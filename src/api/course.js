import request from '@/utils/request'

export function saveCourseInfo(courseInfo) {
  return request({
    url: '/admin/edu/course/saveCourseInfo',
    method: 'post',
    data: courseInfo
  })
}

export function getCourseInfo(courseId) {
  return request({
    url: `/admin/edu/course/getCourseInfo/${courseId}`,
    method: 'get'

  })
}

export function updateCourseInfo(courseInfo) {
  return request({
    url: '/admin/edu/course/updateCourse',
    method: 'put',
    data: courseInfo
  })
}

export function getCoursePageList(page, limit, searchObj) {
  return request({
    url: `/admin/edu/course/list/${page}/${limit}`,
    method: 'get',
    params: searchObj
  })
}

export function removeCourseById(courseId) {
  return request({
    url: '/admin/edu/course/removeCourse',
    method: 'delete',
    params: courseId
  })
}

export function getPublishCourse(courseId) {
  return request({
    url: `/admin/edu/course/getCoursePublish/${courseId}`,
    method: 'get'
  })
}

export function publishCourseById(courseId) {
  return request({
    url: `/admin/edu/course/publishCourse/${courseId}`,
    method: 'get'
  })
}
