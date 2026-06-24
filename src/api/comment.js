import { get, post } from '@/utils/request'

export function getCommentList(poiId, sortBy = 'hot') {
  return get('/comment/list', { poiId, sortBy })
}

export function postComment(data) {
  return post('/comment/add', data)
}

export function toggleCommentLike(commentId) {
  return post(`/comment/like/${commentId}`)
}
