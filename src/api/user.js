import { mockUser, tripList } from '@/mock/user'

export function getUserInfo() {
  return Promise.resolve(mockUser)
}

export function getTripList() {
  return Promise.resolve(tripList)
}

export function loginByPhone(data) {
  return Promise.resolve({ token: 'mock_token_' + Date.now(), userInfo: { ...mockUser, phone: data.phone } })
}

export function loginByWechat() {
  return Promise.resolve({ token: 'mock_token_wx_' + Date.now(), userInfo: mockUser })
}
