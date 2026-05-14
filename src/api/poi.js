import { get, post } from '@/utils/request'

export function getPoiList(params) {
  return get('/api/poi/list', params)
}

export function getPoiDetail(id) {
  return get(`/api/poi/detail/${id}`)
}

export function getHotPoi(limit = 10) {
  return get('/api/poi/hot', { limit })
}

export function getRouteList() {
  return get('/api/poi/route')
}

export function toggleFavorite(id) {
  return post(`/api/poi/favorite/${id}`)
}
