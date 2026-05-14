import { get } from '@/utils/request'

export function getCommunityData(tag = '') {
  return get('/api/community/list', { tag })
}
