"use strict";
const common_vendor = require("../../common/vendor.js");
const store_app = require("../../store/app.js");
const utils_safeArea = require("../../utils/safeArea.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const appStore = store_app.useAppStore();
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const currentCity = common_vendor.computed(() => appStore.currentCity);
    const keyword = common_vendor.ref("");
    const scrollIntoId = common_vendor.ref("");
    const activeLetter = common_vendor.ref("");
    const letterToastVisible = common_vendor.ref(false);
    let letterToastTimer = null;
    const hotCities = [
      { name: "北京", latitude: 39.9042, longitude: 116.4074 },
      { name: "上海", latitude: 31.2304, longitude: 121.4737 },
      { name: "广州", latitude: 23.1291, longitude: 113.2644 },
      { name: "深圳", latitude: 22.5431, longitude: 114.0579 },
      { name: "杭州", latitude: 30.2741, longitude: 120.1552 },
      { name: "成都", latitude: 30.5728, longitude: 104.0668 },
      { name: "重庆", latitude: 29.4316, longitude: 106.9123 },
      { name: "武汉", latitude: 30.5928, longitude: 114.3055 }
    ];
    const tourCities = [
      { name: "三亚", latitude: 18.2208, longitude: 109.5076, desc: "热带海滨度假胜地", image: "" },
      { name: "丽江", latitude: 26.8642, longitude: 100.2365, desc: "古城风韵，浪漫之都", image: "" },
      { name: "西安", latitude: 34.2619, longitude: 108.9463, desc: "十三朝古都，历史名城", image: "" },
      { name: "张家界", latitude: 29.1171, longitude: 110.4716, desc: "奇峰异石，人间仙境", image: "" },
      { name: "桂林", latitude: 25.2741, longitude: 110.2993, desc: "山水甲天下", image: "" }
    ];
    const allCities = [
      { name: "安庆", latitude: 30.5296, longitude: 117.0555 },
      { name: "安阳", latitude: 36.1052, longitude: 114.3535 },
      { name: "鞍山", latitude: 41.1215, longitude: 122.9956 },
      { name: "包头", latitude: 40.6576, longitude: 109.8245 },
      { name: "北京", latitude: 39.9042, longitude: 116.4074 },
      { name: "保定", latitude: 38.8689, longitude: 115.4803 },
      { name: "长春", latitude: 43.8868, longitude: 125.3245 },
      { name: "长沙", latitude: 28.228, longitude: 112.9388 },
      { name: "常州", latitude: 31.7729, longitude: 119.9599 },
      { name: "成都", latitude: 30.5728, longitude: 104.0668 },
      { name: "重庆", latitude: 29.4316, longitude: 106.9123 },
      { name: "大连", latitude: 38.914, longitude: 121.6147 },
      { name: "东莞", latitude: 23.0239, longitude: 113.7573 },
      { name: "佛山", latitude: 23.0221, longitude: 113.1138 },
      { name: "福州", latitude: 26.0753, longitude: 119.2877 },
      { name: "广州", latitude: 23.1291, longitude: 113.2644 },
      { name: "贵阳", latitude: 26.5784, longitude: 106.7135 },
      { name: "哈尔滨", latitude: 45.8038, longitude: 126.535 },
      { name: "邯郸", latitude: 36.6176, longitude: 114.4777 },
      { name: "杭州", latitude: 30.2741, longitude: 120.1552 },
      { name: "合肥", latitude: 31.8642, longitude: 117.2272 },
      { name: "呼和浩特", latitude: 40.8173, longitude: 111.6706 },
      { name: "惠州", latitude: 23.106, longitude: 114.4212 },
      { name: "济南", latitude: 36.6682, longitude: 116.9979 },
      { name: "嘉兴", latitude: 30.7578, longitude: 120.4792 },
      { name: "江门", latitude: 22.5626, longitude: 113.0931 },
      { name: "揭阳", latitude: 23.5438, longitude: 116.3721 },
      { name: "金华", latitude: 29.1065, longitude: 119.6451 },
      { name: "昆明", latitude: 25.0389, longitude: 102.7183 },
      { name: "兰州", latitude: 36.0611, longitude: 103.8343 },
      { name: "连云港", latitude: 34.5957, longitude: 119.1198 },
      { name: "聊城", latitude: 36.456, longitude: 115.9764 },
      { name: "洛阳", latitude: 34.6234, longitude: 112.4536 },
      { name: "马鞍山", latitude: 31.6805, longitude: 118.5143 },
      { name: "茂名", latitude: 21.6839, longitude: 110.9159 },
      { name: "南昌", latitude: 28.6826, longitude: 115.8922 },
      { name: "南京", latitude: 32.0603, longitude: 118.7969 },
      { name: "南宁", latitude: 22.8157, longitude: 108.3201 },
      { name: "宁波", latitude: 29.8738, longitude: 121.5469 },
      { name: "青岛", latitude: 36.0671, longitude: 120.3826 },
      { name: "泉州", latitude: 24.9119, longitude: 118.5898 },
      { name: "三亚", latitude: 18.2208, longitude: 109.5076 },
      { name: "上海", latitude: 31.2304, longitude: 121.4737 },
      { name: "绍兴", latitude: 30.0163, longitude: 120.5853 },
      { name: "深圳", latitude: 22.5431, longitude: 114.0579 },
      { name: "沈阳", latitude: 41.8045, longitude: 123.4328 },
      { name: "石家庄", latitude: 38.0423, longitude: 114.4786 },
      { name: "苏州", latitude: 31.3251, longitude: 120.6196 },
      { name: "太原", latitude: 37.8706, longitude: 112.5492 },
      { name: "天津", latitude: 39.1422, longitude: 117.2076 },
      { name: "温州", latitude: 28.0118, longitude: 120.6529 },
      { name: "乌鲁木齐", latitude: 43.826, longitude: 87.6169 },
      { name: "无锡", latitude: 31.5977, longitude: 120.3099 },
      { name: "武汉", latitude: 30.5928, longitude: 114.3055 },
      { name: "西安", latitude: 34.2619, longitude: 108.9463 },
      { name: "厦门", latitude: 24.4798, longitude: 118.0894 },
      { name: "烟台", latitude: 37.5378, longitude: 121.3965 },
      { name: "扬州", latitude: 32.3943, longitude: 119.4482 },
      { name: "宜昌", latitude: 30.7173, longitude: 111.3076 },
      { name: "银川", latitude: 38.4757, longitude: 106.2711 },
      { name: "湛江", latitude: 21.2708, longitude: 110.3567 },
      { name: "郑州", latitude: 34.7466, longitude: 113.6253 },
      { name: "中山", latitude: 22.5214, longitude: 113.397 },
      { name: "珠海", latitude: 22.2754, longitude: 113.5679 },
      { name: "淄博", latitude: 36.8021, longitude: 117.8586 }
    ];
    const letters = ["A", "B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    const searchResult = common_vendor.computed(() => {
      if (!keyword.value.trim()) return [];
      const kw = keyword.value.trim().toLowerCase();
      return allCities.filter((city) => {
        return city.name.includes(kw) || getFullPinyin(city.name).includes(kw);
      });
    });
    const groupedCities = common_vendor.computed(() => {
      const groups = {};
      allCities.forEach((city) => {
        const firstLetter = getFirstLetter(city.name);
        if (!groups[firstLetter]) {
          groups[firstLetter] = [];
        }
        groups[firstLetter].push(city);
      });
      return groups;
    });
    function getFullPinyin(name) {
      const pinyinMap = {
        "安": "an",
        "包": "bao",
        "北": "bei",
        "保": "bao",
        "长": "chang",
        "常": "chang",
        "成": "cheng",
        "重": "chong",
        "大": "da",
        "东": "dong",
        "佛": "fo",
        "福": "fu",
        "广": "guang",
        "贵": "gui",
        "哈": "ha",
        "邯": "han",
        "杭": "hang",
        "合": "he",
        "和": "he",
        "惠": "hui",
        "济": "ji",
        "嘉": "jia",
        "江": "jiang",
        "揭": "jie",
        "金": "jin",
        "昆": "kun",
        "兰": "lan",
        "连": "lian",
        "聊": "liao",
        "洛": "luo",
        "马": "ma",
        "茂": "mao",
        "南": "nan",
        "宁": "ning",
        "青": "qing",
        "泉": "quan",
        "三": "san",
        "上": "shang",
        "绍": "shao",
        "深": "shen",
        "沈": "shen",
        "石": "shi",
        "苏": "su",
        "太": "tai",
        "天": "tian",
        "温": "wen",
        "乌": "wu",
        "无": "wu",
        "武": "wu",
        "西": "xi",
        "厦": "xia",
        "烟": "yan",
        "扬": "yang",
        "宜": "yi",
        "银": "yin",
        "湛": "zhan",
        "郑": "zheng",
        "中": "zhong",
        "珠": "zhu",
        "淄": "zi"
      };
      let result = "";
      for (const char of name) {
        result += pinyinMap[char] || char;
      }
      return result;
    }
    function getFirstLetter(name) {
      const char = name.charAt(0);
      const regex = /^[A-Za-z]/;
      if (regex.test(char)) {
        return char.toUpperCase();
      }
      const pinyinMap = {
        "安": "A",
        "包": "B",
        "北": "B",
        "保": "B",
        "长": "C",
        "常": "C",
        "成": "C",
        "重": "C",
        "大": "D",
        "东": "D",
        "佛": "F",
        "福": "F",
        "广": "G",
        "贵": "G",
        "哈": "H",
        "邯": "H",
        "杭": "H",
        "合": "H",
        "和": "H",
        "惠": "H",
        "济": "J",
        "嘉": "J",
        "江": "J",
        "揭": "J",
        "金": "J",
        "昆": "K",
        "兰": "L",
        "连": "L",
        "聊": "L",
        "洛": "L",
        "马": "M",
        "茂": "M",
        "南": "N",
        "宁": "N",
        "青": "Q",
        "泉": "Q",
        "三": "S",
        "上": "S",
        "绍": "S",
        "深": "S",
        "沈": "S",
        "石": "S",
        "苏": "S",
        "太": "T",
        "天": "T",
        "温": "W",
        "乌": "W",
        "无": "W",
        "武": "W",
        "西": "X",
        "厦": "X",
        "烟": "Y",
        "扬": "Y",
        "宜": "Y",
        "银": "Y",
        "湛": "Z",
        "郑": "Z",
        "中": "Z",
        "珠": "Z",
        "淄": "Z"
      };
      return pinyinMap[char] || "#";
    }
    common_vendor.onMounted(() => {
      if (!currentCity.value) {
        getCurrentLocation();
      }
    });
    function onSearchInput(e) {
      keyword.value = e.detail ? e.detail.value : e;
    }
    function clearSearch() {
      keyword.value = "";
    }
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function getCurrentLocation() {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: async (res) => {
          appStore.setLocation({ latitude: res.latitude, longitude: res.longitude });
          await getCityName(res.latitude, res.longitude);
        },
        fail: () => {
        }
      });
    }
    function refreshLocation() {
      common_vendor.index.showLoading({ title: "定位中..." });
      common_vendor.index.getLocation({
        type: "gcj02",
        success: async (res) => {
          common_vendor.index.hideLoading();
          appStore.setLocation({ latitude: res.latitude, longitude: res.longitude });
          await getCityName(res.latitude, res.longitude);
          common_vendor.index.showToast({ title: "定位成功", icon: "success" });
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "定位失败", icon: "none" });
        }
      });
    }
    async function getCityName(latitude, longitude) {
      try {
        const res = await common_vendor.index.request({
          url: `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=313cf99032e645454c787cb07736e312&extensions=all`,
          method: "GET"
        });
        if (res.data && res.data.status === "1") {
          const city = res.data.regeocode.addressComponent.city || res.data.regeocode.addressComponent.province;
          if (city) {
            const cityName = city.replace("市", "");
            appStore.setCity(cityName);
          }
        }
      } catch (e) {
        console.error("获取城市名称失败", e);
      }
    }
    function selectCity(city) {
      appStore.setCity(city.name);
      appStore.setLocation({ latitude: city.latitude, longitude: city.longitude });
      common_vendor.index.navigateBack();
    }
    function scrollToLetter(letter) {
      activeLetter.value = letter;
      scrollIntoId.value = "";
      setTimeout(() => {
        scrollIntoId.value = "letter-" + letter;
      }, 50);
      showLetterToast();
    }
    function onLetterTouch(letter) {
      activeLetter.value = letter;
      showLetterToast();
    }
    function showLetterToast(letter) {
      letterToastVisible.value = true;
      if (letterToastTimer) {
        clearTimeout(letterToastTimer);
      }
      letterToastTimer = setTimeout(() => {
        letterToastVisible.value = false;
      }, 800);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.unref(statusBarHeight) + "px",
        c: keyword.value,
        d: common_vendor.o(onSearchInput),
        e: keyword.value
      }, keyword.value ? {
        f: common_vendor.o(clearSearch)
      } : {}, {
        g: keyword.value
      }, keyword.value ? common_vendor.e({
        h: searchResult.value.length > 0
      }, searchResult.value.length > 0 ? {
        i: common_vendor.f(searchResult.value, (city, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(city.name),
            b: city.name === currentCity.value
          }, city.name === currentCity.value ? {} : {}, {
            c: city.name,
            d: city.name === currentCity.value ? 1 : "",
            e: common_vendor.o(($event) => selectCity(city), city.name)
          });
        })
      } : {}) : {
        j: common_vendor.t(currentCity.value),
        k: common_vendor.o(refreshLocation),
        l: common_vendor.f(hotCities, (city, k0, i0) => {
          return {
            a: common_vendor.t(city.name),
            b: city.name,
            c: city.name === currentCity.value ? 1 : "",
            d: common_vendor.o(($event) => selectCity(city), city.name)
          };
        }),
        m: common_vendor.f(tourCities, (city, k0, i0) => {
          return common_vendor.e({
            a: city.image,
            b: common_vendor.t(city.name),
            c: common_vendor.t(city.desc),
            d: city.name === currentCity.value
          }, city.name === currentCity.value ? {} : {}, {
            e: city.name,
            f: common_vendor.o(($event) => selectCity(city), city.name)
          });
        }),
        n: common_vendor.f(groupedCities.value, (group, letter, i0) => {
          return {
            a: common_vendor.t(letter),
            b: common_vendor.f(group, (city, k1, i1) => {
              return common_vendor.e({
                a: common_vendor.t(city.name),
                b: city.name === currentCity.value
              }, city.name === currentCity.value ? {} : {}, {
                c: city.name,
                d: city.name === currentCity.value ? 1 : "",
                e: common_vendor.o(($event) => selectCity(city), city.name)
              });
            }),
            c: letter,
            d: "letter-" + letter
          };
        }),
        o: scrollIntoId.value
      }, {
        p: common_vendor.f(letters, (letter, k0, i0) => {
          return {
            a: common_vendor.t(letter),
            b: letter,
            c: activeLetter.value === letter ? 1 : "",
            d: common_vendor.o(($event) => onLetterTouch(letter), letter),
            e: common_vendor.o(($event) => scrollToLetter(letter), letter)
          };
        }),
        q: letterToastVisible.value
      }, letterToastVisible.value ? {
        r: common_vendor.t(activeLetter.value)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0bee7659"]]);
wx.createPage(MiniProgramPage);
