import { get, post } from '@/utils/request'
import { poiList, getPoiById, getHotPoiList, routeList } from '@/mock/poi'

export function getPoiList(params) {
  return Promise.resolve({ list: poiList, total: poiList.length })
}

export function getPoiDetail(id) {
  const poi = getPoiById(id)
  return Promise.resolve(poi || null)
}

export function getHotPoi(limit = 10) {
  return Promise.resolve(getHotPoiList(limit))
}

export function getRouteList() {
  return Promise.resolve(routeList)
}

export function toggleFavorite(id) {
  const poi = getPoiById(id)
  if (poi) poi.isFavorite = !poi.isFavorite
  return Promise.resolve(poi)
}
