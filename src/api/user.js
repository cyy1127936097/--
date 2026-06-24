import { get, post, put } from '@/utils/request'

export function getUserInfo() {
  return get('/user/info')
}

export function getTripList() {
  return get('/trip/list')
}

export function createTrip(data) {
  return post('/trip/create', data)
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
