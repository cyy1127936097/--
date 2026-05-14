const AMAP_KEY = '313cf99032e645454c787cb07736e312'

function reverseGeocodeAmap(latitude, longitude) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      method: 'GET',
      data: {
        key: AMAP_KEY,
        location: `${longitude},${latitude}`,
        extensions: 'base'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.status === '1') {
          const addr = res.data.regeocode.addressComponent
          const city = addr.city || addr.province || ''
          resolve(city.replace('市', ''))
        } else {
          reject(new Error('高德逆地理编码返回异常'))
        }
      },
      fail: (err) => reject(err)
    })
  })
}

function reverseGeocodeQQ(latitude, longitude) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    try {
      const QQMapWX = require('@/libs/qqmap-wx-jssdk.min.js')
      const qqmapsdk = new QQMapWX({
        key: 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'
      })
      qqmapsdk.reverseGeocoder({
        location: { latitude, longitude },
        success: (res) => {
          const city = res.result?.address_component?.city || res.result?.ad_info?.city || ''
          if (city) {
            resolve(city.replace('市', ''))
          } else {
            reject(new Error('腾讯逆地理编码返回空'))
          }
        },
        fail: (err) => reject(err)
      })
    } catch (e) {
      reject(e)
    }
    // #endif
    // #ifndef MP-WEIXIN
    reject(new Error('非微信小程序环境'))
    // #endif
  })
}

export function reverseGeocode(latitude, longitude) {
  return reverseGeocodeAmap(latitude, longitude).catch(() => {
    return reverseGeocodeQQ(latitude, longitude)
  })
}

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({ latitude: res.latitude, longitude: res.longitude })
      },
      fail: (err) => reject(err)
    })
  })
}
