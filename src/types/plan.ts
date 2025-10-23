/**
 * 行程相关类型定义
 */

// 活动信息
export interface Activity {
  time: string
  title: string
  location: string
  address: string
  duration: number // 分钟
  description: string
  estimated_cost: number
  tips?: string
}

// 每日行程
export interface DailyPlan {
  day: number
  title: string
  activities: Activity[]
}

// 住宿信息
export interface Accommodation {
  day: number
  hotel_name: string
  address: string
  price_range: string
  rating: string
  reason: string
}

// 交通详情
export interface TransportDetail {
  type: string // 飞机/火车/地铁/公交
  route: string
  estimated_cost: number
}

// 交通信息
export interface Transportation {
  overview: string
  details: TransportDetail[]
}

// 费用明细
export interface BudgetBreakdown {
  transportation: number
  accommodation: number
  food: number
  activities: number
  shopping: number
  other: number
  total: number
}

// AI 返回的完整数据
export interface AIResponse {
  title: string
  destination: string
  days: number
  budget: number
  travelers: number
  preferences: string[]
  start_date: string
  summary: string
  daily_plans: DailyPlan[]
  accommodation: Accommodation[]
  transportation: Transportation
  budget_breakdown: BudgetBreakdown
}

// 旅行行程
export interface TravelPlan {
  id: string
  user_id: string
  title: string
  destination: string
  days: number
  budget: number
  travelers: number
  preferences: string[]
  start_date: string
  summary: string
  ai_response: AIResponse
  created_at: string
  updated_at: string
}

// 行程列表项（精简版）
export interface PlanListItem {
  id: string
  title: string
  destination: string
  days: number
  budget: number
  start_date: string
  created_at: string
}

