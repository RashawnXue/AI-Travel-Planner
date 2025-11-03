/**
 * 高德地图工具类
 */

// 声明高德地图全局类型
declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: {
      securityJsCode: string
    }
  }
}

// 高德地图配置（可以从环境变量或配置文件读取）
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || ''
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || ''

// 标记地图是否正在加载
let isLoading = false
let loadPromise: Promise<any> | null = null

/**
 * 动态加载高德地图 JS API
 */
function loadAMapScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    // 如果没有配置 Key，使用演示 Key
    const key = AMAP_KEY || 'c3747ba494f6df86d0b501fc253ff5b9' // 演示 Key，请替换为你自己的
    
    // 设置安全密钥（如果有）
    if (AMAP_SECURITY_CODE) {
      window._AMapSecurityConfig = {
        securityJsCode: AMAP_SECURITY_CODE
      }
    }

    // 创建 script 标签
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`
    script.async = true

    script.onload = () => {
      resolve(window.AMap)
    }

    script.onerror = () => {
      reject(new Error('高德地图 JS API 加载失败'))
    }

    document.head.appendChild(script)
  })
}

/**
 * 等待高德地图加载完成
 */
export function waitForAMap(): Promise<any> {
  return new Promise((resolve, reject) => {
    // 如果已经加载完成
    if (window.AMap) {
      resolve(window.AMap)
      return
    }

    // 如果正在加载，等待加载完成
    if (isLoading && loadPromise) {
      loadPromise.then(resolve).catch(reject)
      return
    }

    // 开始加载
    isLoading = true
    loadPromise = loadAMapScript()
    
    loadPromise
      .then((AMap) => {
        isLoading = false
        resolve(AMap)
      })
      .catch((error) => {
        isLoading = false
        loadPromise = null
        reject(error)
      })
  })
}

/**
 * 创建地图实例
 * @param container 容器元素 ID 或 DOM 元素
 * @param options 地图配置选项
 */
export async function createMap(
  container: string | HTMLElement,
  options: {
    center?: [number, number] // [经度, 纬度]
    zoom?: number
    [key: string]: any
  } = {}
) {
  const AMap = await waitForAMap()

  const defaultOptions = {
    zoom: 12,
    viewMode: '2D',
    ...options
  }

  return new AMap.Map(container, defaultOptions)
}

/**
 * 添加标记点
 * @param map 地图实例
 * @param position 位置 [经度, 纬度]
 * @param options 标记选项
 */
export async function addMarker(
  map: any,
  position: [number, number],
  options: {
    title?: string
    content?: string
    icon?: string
    label?: any
    [key: string]: any
  } = {}
) {
  const AMap = await waitForAMap()

  const marker = new AMap.Marker({
    position,
    ...options
  })

  marker.setMap(map)
  return marker
}

/**
 * 添加折线（路线）
 * @param map 地图实例
 * @param path 路径点数组 [[经度, 纬度], ...]
 * @param options 折线选项
 */
export async function addPolyline(
  map: any,
  path: Array<[number, number]>,
  options: {
    strokeColor?: string
    strokeWeight?: number
    strokeOpacity?: number
    [key: string]: any
  } = {}
) {
  const AMap = await waitForAMap()

  const defaultOptions = {
    strokeColor: '#667eea',
    strokeWeight: 6,
    strokeOpacity: 0.8,
    lineJoin: 'round',
    ...options
  }

  const polyline = new AMap.Polyline({
    path,
    ...defaultOptions
  })

  polyline.setMap(map)
  return polyline
}

/**
 * 添加信息窗体
 * @param map 地图实例
 * @param position 位置 [经度, 纬度]
 * @param content 内容
 */
export async function addInfoWindow(
  map: any,
  position: [number, number],
  content: string
) {
  const AMap = await waitForAMap()

  const infoWindow = new AMap.InfoWindow({
    content,
    offset: new AMap.Pixel(0, -30)
  })

  infoWindow.open(map, position)
  return infoWindow
}

/**
 * 自适应显示所有标记点
 * @param map 地图实例
 * @param points 点位数组 [[经度, 纬度], ...]
 */
export function fitView(map: any, points: Array<[number, number]>) {
  if (points.length === 0) return

  if (points.length === 1) {
    map.setCenter(points[0])
    map.setZoom(15)
  } else {
    map.setFitView()
  }
}

