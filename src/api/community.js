import { get } from '@/utils/request'

export function getCommunityData(tag = '') {
  return get('/community/list', { tag })
}
