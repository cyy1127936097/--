"use strict";
const poiList = [
  {
    id: 1,
    name: "鼓浪屿",
    category: "户外/风光",
    rating: 4.8,
    commentCount: 128,
    description: "国家5A级景区，万国建筑博览会。",
    aiSummary: "多数游客认为鼓浪屿建筑风格独特，适合拍照打卡。岛上无机动车，非常安静，但建议避开节假日高峰期，体验感更佳。",
    openTime: "全天开放",
    ticketPrice: "免费(船票35元)",
    traffic: "轮渡码头登船",
    topRank: "厦门景点TOP 1",
    latitude: 24.4483,
    longitude: 118.065,
    images: [
      "https://picsum.photos/seed/gulangyu1/750/560",
      "https://picsum.photos/seed/gulangyu2/750/560",
      "https://picsum.photos/seed/gulangyu3/750/560"
    ],
    iconType: "mountain",
    markerColor: "#4ECDC4",
    isFavorite: false
  },
  {
    id: 2,
    name: "曾厝垵",
    category: "美食/文创",
    rating: 4.5,
    commentCount: 96,
    description: "中国最文艺渔村，美食与文创的天堂。",
    aiSummary: "曾厝垵是厦门最具文艺气息的渔村，汇聚了各地小吃和手工艺品。建议傍晚前往，可以看日落，夜市氛围更好。",
    openTime: "全天开放",
    ticketPrice: "免费",
    traffic: "公交29/47路",
    topRank: "厦门景点TOP 3",
    latitude: 24.4367,
    longitude: 118.089,
    images: [
      "https://picsum.photos/seed/zengcuoan1/750/560",
      "https://picsum.photos/seed/zengcuoan2/750/560"
    ],
    iconType: "camera",
    markerColor: "#FF9F43",
    isFavorite: false
  },
  {
    id: 3,
    name: "沙坡尾",
    category: "美食/文艺",
    rating: 4.6,
    commentCount: 78,
    description: "厦门发源地，文艺与美食的碰撞。",
    aiSummary: "沙坡尾是厦门最古老的渔港，如今已成为文艺青年聚集地。推荐午后到访，逛逛独立书店和咖啡馆，傍晚可以看渔船归港。",
    openTime: "全天开放",
    ticketPrice: "免费",
    traffic: "公交71/86路",
    topRank: "厦门景点TOP 5",
    latitude: 24.4417,
    longitude: 118.079,
    images: [
      "https://picsum.photos/seed/shapowei1/750/560",
      "https://picsum.photos/seed/shapowei2/750/560"
    ],
    iconType: "silverware-fork-knife",
    markerColor: "#4ECDC4",
    isFavorite: false
  },
  {
    id: 4,
    name: "厦门大学",
    category: "人文/校园",
    rating: 4.7,
    commentCount: 156,
    description: "中国最美大学之一，芙蓉湖与芙蓉隧道。",
    aiSummary: "厦门大学被誉为中国最美大学，芙蓉湖和芙蓉隧道是必打卡点。需提前预约入校，建议工作日前往避开人流。",
    openTime: "需预约",
    ticketPrice: "免费",
    traffic: "公交1/15路",
    topRank: "厦门景点TOP 2",
    latitude: 24.4397,
    longitude: 118.087,
    images: [
      "https://picsum.photos/seed/xmu1/750/560",
      "https://picsum.photos/seed/xmu2/750/560"
    ],
    iconType: "school",
    markerColor: "#4ECDC4",
    isFavorite: true
  },
  {
    id: 5,
    name: "南普陀寺",
    category: "宗教/文化",
    rating: 4.5,
    commentCount: 89,
    description: "千年古刹，闽南佛教圣地。",
    aiSummary: "南普陀寺是厦门最著名的佛教寺院，香火旺盛。可以爬后山五老峰看厦门全景，寺内素饼非常有名。",
    openTime: "08:00-17:00",
    ticketPrice: "免费",
    traffic: "公交1/15路",
    topRank: "厦门景点TOP 4",
    latitude: 24.438,
    longitude: 118.09,
    images: [
      "https://picsum.photos/seed/nanputuo1/750/560"
    ],
    iconType: "temple-buddhist",
    markerColor: "#FF9F43",
    isFavorite: false
  },
  {
    id: 6,
    name: "环岛路",
    category: "户外/骑行",
    rating: 4.6,
    commentCount: 67,
    description: "最美海岸线骑行路线。",
    aiSummary: "环岛路是厦门最美的海岸线，适合骑行和散步。推荐从白城沙滩出发到黄厝沙滩，沿途风景绝美。",
    openTime: "全天开放",
    ticketPrice: "免费",
    traffic: "公交29路",
    topRank: "厦门景点TOP 6",
    latitude: 24.434,
    longitude: 118.095,
    images: [
      "https://picsum.photos/seed/huandao1/750/560"
    ],
    iconType: "bike",
    markerColor: "#4ECDC4",
    isFavorite: false
  }
];
function getPoiById(id) {
  return poiList.find((item) => item.id === id);
}
function getHotPoiList(limit = 10) {
  return [...poiList].sort((a, b) => b.rating - a.rating).slice(0, limit);
}
exports.getHotPoiList = getHotPoiList;
exports.getPoiById = getPoiById;
exports.poiList = poiList;
