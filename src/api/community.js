import { get, post } from '@/utils/request'

export function getCommunityData(tag = '', city = '') {
  return get('/community/list', { tag, city })
}

export function getCommunityDetail(id) {
  return get(`/community/detail/${id}`)
}

export function likeCommunityPost(id) {
  return post(`/community/like/${id}`)
}

export function getCommunityComments(postId, sort = 'hot') {
  return get('/community/comments', { postId, sort })
}

export function postCommunityComment(data) {
  return post('/community/comment', data)
}

export function searchAll(keyword, city = '') {
  return get('/search', { keyword, city })
}
