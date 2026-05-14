import { getCommentsByPoiId } from '@/mock/comment'

export function getCommentList(poiId, sortBy = 'hot') {
  return Promise.resolve(getCommentsByPoiId(poiId, sortBy))
}

export function postComment(data) {
  return Promise.resolve({ id: Date.now(), ...data, likeCount: 0, isLiked: false, createTime: new Date().toISOString() })
}

export function toggleCommentLike(commentId) {
  return Promise.resolve({ commentId, isLiked: true })
}
