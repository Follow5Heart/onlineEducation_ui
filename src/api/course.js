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

