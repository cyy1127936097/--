export const commentList = [
  {
    id: 1,
    poiId: 1,
    userName: '爱旅行的小王',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    rating: 5,
    content: '真的太美了！每一条巷子都很有味道，八卦楼一定要去，拍照绝绝子！',
    images: [
      'https://picsum.photos/seed/comment1a/200/200',
      'https://picsum.photos/seed/comment1b/200/200'
    ],
    likeCount: 56,
    isLiked: false,
    createTime: '2024-05-10',
    replies: []
  },
  {
    id: 2,
    poiId: 1,
    userName: '摄影师老王',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    rating: 4,
    content: '建筑风格独特，很适合拍照。就是节假日人太多了，建议工作日去。',
    images: [
      'https://picsum.photos/seed/comment2a/200/200'
    ],
    likeCount: 32,
    isLiked: true,
    createTime: '2024-05-08',
    replies: [
      {
        id: 201,
        userName: '旅行达人小李',
        content: '同意！工作日去体验感好很多',
        createTime: '2024-05-09'
      }
    ]
  },
  {
    id: 3,
    poiId: 1,
    userName: '吃货日记',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    rating: 5,
    content: '岛上的小吃太丰富了！鱼丸汤和沙茶面必吃，推荐龙头路的那家老店。',
    images: [],
    likeCount: 28,
    isLiked: false,
    createTime: '2024-05-06',
    replies: []
  },
  {
    id: 4,
    poiId: 1,
    userName: '文艺小清新',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    rating: 4,
    content: '在鼓浪屿漫步真的太治愈了，每一栋建筑都有故事。推荐日落时分去日光岩，风景绝美！',
    images: [
      'https://picsum.photos/seed/comment4a/200/200',
      'https://picsum.photos/seed/comment4b/200/200',
      'https://picsum.photos/seed/comment4c/200/200'
    ],
    likeCount: 45,
    isLiked: false,
    createTime: '2024-05-04',
    replies: []
  },
  {
    id: 5,
    poiId: 1,
    userName: '户外探险家',
    avatar: 'https://picsum.photos/seed/user5/100/100',
    rating: 5,
    content: '岛上没有机动车，空气特别好，适合慢慢走慢慢看。建议至少安排半天时间。',
    images: [],
    likeCount: 19,
    isLiked: false,
    createTime: '2024-05-02',
    replies: []
  }
]

export function getCommentsByPoiId(poiId, sortBy = 'hot') {
  const list = commentList.filter(item => item.poiId === poiId)
  if (sortBy === 'hot') {
    return list.sort((a, b) => b.likeCount - a.likeCount)
  }
  return list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
}
