import request from '@/utils/request'

export function removeVideo(videoSourceId) {
  return request({
    url: `/service-vod/video/removeVideo/${videoSourceId}`,
    method: 'delete'

  })
}
