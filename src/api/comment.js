import { get, post } from '@/utils/request'

export function getCommentList(poiId, sortBy = 'hot') {
  return get('/api/comment/list', { poiId, sortBy })
}

export function postComment(data) {
  return post('/api/comment/add', data)
}

export function toggleCommentLike(commentId) {
  return post(`/api/comment/like/${commentId}`)
}
