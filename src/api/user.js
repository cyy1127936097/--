import { get, post, put, del, uploadFile } from '@/utils/request'

export function getUserInfo() {
  return get('/user/info')
}

export function getTripList(city) {
  return get('/trip/list', city ? { city } : {})
}

export function getTripDetail(id) {
  return get('/trip/' + id)
}

export function createTrip(data) {
  return post('/trip/create', data)
}

export function deleteTrip(id) {
  return del('/trip/' + id)
}

export function loginByPhone(data) {
  return post('/user/login/phone', data)
}

export function loginByWechat() {
  return post('/user/login/wechat')
}

export function updateUserInfo(data) {
  return put('/user/info', data)
}

export function uploadAvatar(filePath) {
  return uploadFile(filePath, 'file')
}
