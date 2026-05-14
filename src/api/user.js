import { mockUser, tripList } from '@/mock/user'

const TEST_PHONE = '123'
const TEST_CODE = '123'

export function getUserInfo() {
  return Promise.resolve(mockUser)
}

export function getTripList() {
  return Promise.resolve(tripList)
}

export function loginByPhone(data) {
  if (data.phone === TEST_PHONE && data.code === TEST_CODE) {
    return Promise.resolve({ token: 'mock_token_' + Date.now(), userInfo: { ...mockUser, phone: data.phone } })
  }
  return Promise.reject(new Error('手机号或验证码错误'))
}

export function loginByWechat() {
  return Promise.resolve({ token: 'mock_token_wx_' + Date.now(), userInfo: mockUser })
}
