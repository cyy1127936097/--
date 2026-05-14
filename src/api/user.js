import { get, post } from '@/utils/request'

export function getUserInfo() {
  return get('/api/user/info')
}

export function getTripList() {
  return get('/api/trip/list')
}

export function loginByPhone(data) {
  return post('/api/user/login/phone', data)
}

export function loginByWechat() {
  return post('/api/user/login/wechat')
}
