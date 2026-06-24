import { get, post } from '@/utils/request'

export function getPoiList(params = {}) {
  return get('/poi/list', params)
}

export function getPoiDetail(id) {
  return get(`/poi/detail/${id}`)
}

export function getHotPoi(limit = 10, city = '') {
  return get('/poi/hot', { limit, city })
}

export function getRatingPoi(page = 0, size = 20, city = '') {
  return get('/poi/rating', { page, size, city })
}

export function searchPoi(keyword, city = '') {
  return get('/poi/search', { keyword, city })
}

export function getRouteList(city = '') {
  return get('/poi/route', { city })
}

export function toggleFavorite(id) {
  return post(`/poi/favorite/${id}`)
}

export function getRecommendPoi(city = '', limit = 6) {
  return get('/poi/recommend', { city, limit })
}

export function getAiRecommend(city = '', poiId = '', limit = 5) {
  return get('/poi/ai-recommend', { city, poiId, limit })
}

export function getWeather(city = '', lat = '', lon = '') {
  return get('/weather', { city, lat, lon })
}
