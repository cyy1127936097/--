import { getCommunityList, tagList } from '@/mock/community'

export function getCommunityData(tag = '') {
  return Promise.resolve({ list: getCommunityList(tag), tags: tagList })
}
