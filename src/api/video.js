import request from '@/utils/request'

export function saveVideo(eduVideoInfo) {
  return request({
    url: '/service-edu/admin/edu/video/saveVideo',
    method: 'post',
    data: eduVideoInfo
  })
}

export function updateVideo(eduVideoInfo) {
  return request({
    url: '/service-edu/admin/edu/video/updateVideo',
    method: 'put',
    data: eduVideoInfo
  })
}

export function deleteVideo(videoId) {
  return request({
    url: `/service-edu/admin/edu/video/deleteVideo/${videoId}`,
    method: 'delete'
  })
}

export function getVideoById(videoId) {
  return request({
    url: `/service-edu/admin/edu/video/getVideoById/${videoId}`,
    method: 'get'
  })
}

