function getLocationByBrowser() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('浏览器不支持定位'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          coordType: 'wgs84'
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

function getLocationByUni() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          coordType: 'gcj02'
        })
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '定位失败'))
      }
    })
  })
}

export function getLocation() {
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    return getLocationByBrowser().catch(() => getLocationByUni())
  }
  return getLocationByUni()
}

function wgs84ToGcj02(lng, lat) {
  const PI = Math.PI
  const a = 6378245.0
  const ee = 0.00669342162296594323
  let dLat = transformLat(lng - 105.0, lat - 35.0)
  let dLng = transformLng(lng - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
  return {
    latitude: lat + dLat,
    longitude: lng + dLng
  }
}

function transformLat(lng, lat) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320.0 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0
  return ret
}

function transformLng(lng, lat) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0
  return ret
}

function getCityNameByAMapJS(latitude, longitude) {
  return new Promise((resolve) => {
    if (typeof AMap === 'undefined') {
      resolve(null)
      return
    }
    AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({ radius: 1000, extensions: 'base' })
      geocoder.getAddress([longitude, latitude], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const addr = result.regeocode.addressComponent
          resolve({
            city: (addr.city || addr.province || '').replace('市', ''),
            district: addr.district || '',
            township: addr.township || ''
          })
          return
        }
        resolve(null)
      })
    })
  })
}

async function getCityNameByRestApi(latitude, longitude) {
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
      const addr = res.data.regeocode.addressComponent
      return {
        city: (addr.city || addr.province || '').replace('市', ''),
        district: addr.district || '',
        township: addr.township || ''
      }
    }
    return null
  } catch (e) {
    console.error('REST API获取城市名称失败', e)
    return null
  }
}

export async function getAddressDetail(latitude, longitude, coordType = 'gcj02') {
  let gcjLat = latitude
  let gcjLng = longitude
  if (coordType === 'wgs84') {
    const converted = wgs84ToGcj02(longitude, latitude)
    gcjLat = converted.latitude
    gcjLng = converted.longitude
  }

  // #ifdef H5
  const detail = await getCityNameByAMapJS(gcjLat, gcjLng)
  if (detail) return detail
  // #endif

  return await getCityNameByRestApi(gcjLat, gcjLng)
}

export async function getCityName(latitude, longitude, coordType = 'gcj02') {
  let gcjLat = latitude
  let gcjLng = longitude
  if (coordType === 'wgs84') {
    const converted = wgs84ToGcj02(longitude, latitude)
    gcjLat = converted.latitude
    gcjLng = converted.longitude
  }

  // #ifdef H5
  const h5addr = await getCityNameByAMapJS(gcjLat, gcjLng)
  if (h5addr) return h5addr.city
  // #endif

  const rstAddr = await getCityNameByRestApi(gcjLat, gcjLng)
  if (rstAddr) return rstAddr.city
  return null
}
