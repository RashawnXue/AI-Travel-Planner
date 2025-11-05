/**
 * 高德地图工具类
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  options: any = {}
): Promise<any> {
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
  options: any = {}
): Promise<any> {
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
  options: any = {}
): Promise<any> {
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
 * 添加贝塞尔曲线（平滑路线）
 * 高德地图 2.0 版本使用 Polyline 配合贝塞尔曲线插值实现
 * @param map 地图实例
 * @param path 贝塞尔曲线路径数组，格式：[起点lng, 起点lat, 控制点lng, 控制点lat, 终点lng, 终点lat]
 * @param options 曲线选项
 */
export async function addBezierCurve(
  map: any,
  path: Array<[number, number, number, number, number, number]>,
  options: any = {}
): Promise<any> {
  const AMap = await waitForAMap()

  const defaultOptions = {
    strokeColor: '#667eea',
    strokeWeight: 6,
    strokeOpacity: 0.8,
    lineJoin: 'round',
    lineCap: 'round',
    ...options
  }

  // 将贝塞尔曲线路径转换为平滑的点集
  const smoothPoints: Array<[number, number]> = []
  
  for (const segment of path) {
    const [x0, y0, cx, cy, x2, y2] = segment
    // 使用二次贝塞尔曲线公式计算中间点
    // B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
    const steps = 30 // 每段曲线的细分数量，增加平滑度
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const oneMinusT = 1 - t
      const x = oneMinusT * oneMinusT * x0 + 2 * oneMinusT * t * cx + t * t * x2
      const y = oneMinusT * oneMinusT * y0 + 2 * oneMinusT * t * cy + t * t * y2
      smoothPoints.push([x, y])
    }
  }

  // 使用 Polyline 绘制平滑路径
  const polyline = new AMap.Polyline({
    path: smoothPoints,
    ...defaultOptions
  })

  polyline.setMap(map)
  return polyline
}

/**
 * 创建平滑的贝塞尔曲线路径
 * @param points 点位数组
 * @returns 贝塞尔曲线路径（包含控制点）
 * 格式：[起点lng, 起点lat, 控制点lng, 控制点lat, 终点lng, 终点lat]
 */
export function createSmoothPath(points: Array<[number, number]>): Array<[number, number, number, number, number, number]> {
  const result: Array<[number, number, number, number, number, number]> = []
  
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i]!
    const end = points[i + 1]!
    
    // 计算控制点，使曲线更自然
    const dx = end[0] - start[0]
    const dy = end[1] - start[1]
    
    // 计算中点作为控制点，并添加垂直偏移创建弯曲
    const midX = (start[0] + end[0]) / 2
    const midY = (start[1] + end[1]) / 2
    
    // 添加垂直于连线方向的偏移，创建向上的弯曲
    const perpX = -dy * 0.2 // 垂直方向的偏移
    const perpY = dx * 0.2
    
    const controlX = midX + perpX
    const controlY = midY + perpY
    
    // 二次贝塞尔曲线：[起点lng, 起点lat, 控制点lng, 控制点lat, 终点lng, 终点lat]
    result.push([start[0], start[1], controlX, controlY, end[0], end[1]])
  }
  
  return result
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
): Promise<any> {
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
export function fitView(map: any, points: Array<[number, number]>): void {
  if (points.length === 0) return

  if (points.length === 1) {
    map.setCenter(points[0])
    map.setZoom(15)
  } else {
    map.setFitView()
  }
}

