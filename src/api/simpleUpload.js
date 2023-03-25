import request from '@/utils/request'

export function mergeChunk(fileParams) {
  return request({
    url: '/service-vod/video/chunkMerge',
    method: 'get',
    params: fileParams
  })
}
