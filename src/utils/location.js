function getLocationH5() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持定位'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        })
      },
      (err) => {
        const msgs = {
          1: '用户拒绝了定位请求',
          2: '位置信息不可用',
          3: '定位请求超时'
        }
        reject(new Error(msgs[err.code] || '定位失败'))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  })
}

function getLocationNative() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '定位失败'))
      }
    })
  })
}

export function getLocation() {
  // #ifdef H5
  return getLocationH5()
  // #endif
  // #ifndef H5
  return getLocationNative()
  // #endif
}

export async function getCityName(latitude, longitude) {
  try {
    const res = await new Promise((resolve, reject) => {
      uni.request({
        url: `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=313cf99032e645454c787cb07736e312&extensions=all`,
        method: 'GET',
        success: (r) => resolve(r),
        fail: (e) => reject(e)
      })
    })
    if (res.data && res.data.status === '1') {
      const city = res.data.regeocode.addressComponent.city || res.data.regeocode.addressComponent.province
      if (city) {
        return city.replace('市', '')
      }
    }
    return null
  } catch (e) {
    console.error('获取城市名称失败', e)
    return null
  }
}
