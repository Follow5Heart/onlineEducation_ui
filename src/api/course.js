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
