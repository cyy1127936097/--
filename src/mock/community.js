export const communityList = [
  {
    id: 1,
    title: '厦门鼓浪屿一日游攻略🏝️美哭了',
    cover: 'https://picsum.photos/seed/community1/400/300',
    userName: '旅行达人小李',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    likeCount: 1200,
    commentCount: 88,
    gradient: 'linear-gradient(135deg, #FF9F43, #FF6B6B)'
  },
  {
    id: 2,
    title: '厦门大学拍照机位合集📸',
    cover: 'https://picsum.photos/seed/community2/400/300',
    userName: '摄影师老王',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    likeCount: 856,
    commentCount: 42,
    gradient: 'linear-gradient(135deg, #4ECDC4, #44B09E)'
  },
  {
    id: 3,
    title: '八市海鲜市场必吃榜💯',
    cover: 'https://picsum.photos/seed/community3/400/300',
    userName: '吃货日记',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
    likeCount: 2100,
    commentCount: 156,
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  {
    id: 4,
    title: '环岛路骑行路线分享🚴',
    cover: 'https://picsum.photos/seed/community4/400/300',
    userName: '户外探险家',
    avatar: 'https://picsum.photos/seed/avatar4/100/100',
    likeCount: 634,
    commentCount: 28,
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
  },
  {
    id: 5,
    title: '沙坡尾文艺小店探店🎨',
    cover: 'https://picsum.photos/seed/community5/400/300',
    userName: '文艺小清新',
    avatar: 'https://picsum.photos/seed/avatar5/100/100',
    likeCount: 967,
    commentCount: 53,
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)'
  },
  {
    id: 6,
    title: '厦门亲子游3日路线👶',
    cover: 'https://picsum.photos/seed/community6/400/300',
    userName: '小太阳麻麻',
    avatar: 'https://picsum.photos/seed/avatar6/100/100',
    likeCount: 1500,
    commentCount: 112,
    gradient: 'linear-gradient(135deg, #fa709a, #fee140)'
  }
]

export const tagList = ['推荐', '拍照', '美食', '亲子', '文艺', '户外', '骑行', '海景']

export function getCommunityList(tag = '') {
  if (!tag || tag === '推荐') return communityList
  return communityList.filter(() => Math.random() > 0.3)
}
