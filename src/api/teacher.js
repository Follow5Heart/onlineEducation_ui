import request from '@/utils/request'

export function list() {
  return request({
    url: '/admin/edu/teacher/list',
    method: 'get'
  })
}

export function pageList(page, limit, searchObj) {
  return request({
    url: `/admin/edu/teacher/list/${page}/${limit}`,
    method: 'post',
    data: searchObj
  })
}

export function deleteTeacher(teacherObj) {
  return request({
    url: '/admin/edu/teacher/delete',
    method: 'delete',
    data: teacherObj
  })
}

export function batchDelete(idList) {
  return request({
    url: '/admin/edu/teacher/batchDeleteTeacher',
    method: 'delete',
    data: idList
  })
}

export function saveTeacher(teacherObj) {
  return request({
    url: '/admin/edu/teacher/saveTeacher',
    method: 'post',
    data: teacherObj
  })
}

export function queryTeacherById(id) {
  return request({
    url: `/admin/edu/teacher/${id}`,
    method: 'get'

  })
}

export function updateTeacher(teacherObj) {
  return request({
    url: '/admin/edu/teacher/updateTeacher',
    method: 'post',
    data: teacherObj
  })
}

export function queryListNameByKeyword(keyword) {
  return request({
    url: '/admin/edu/teacher/queryListNameByKeyword',
    method: 'get',
    params: { keyword }
  })
}

