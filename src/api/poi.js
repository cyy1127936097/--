import { get, post } from '@/utils/request'

export function getPoiList(params) {
  return get('/poi/list', params)
}

export function getPoiDetail(id) {
  return get(`/poi/detail/${id}`)
}

export function getHotPoi(limit = 10) {
  return get('/poi/hot', { limit })
}

export function getRouteList() {
  return get('/poi/route')
}

export function toggleFavorite(id) {
  return post(`/poi/favorite/${id}`)
}
