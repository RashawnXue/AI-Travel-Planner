-- ============================================
-- 添加测试行程数据
-- ============================================
-- 注意：请将 '87295353-f192-4908-a899-a6d919d67e2b' 替换为实际的用户 ID
-- 可以通过以下 SQL 查询当前用户 ID：
-- SELECT auth.uid();

-- 或者查看所有用户：
-- SELECT id, email FROM auth.users;

-- ============================================
-- 行程 1: 日本东京 5 日游
-- ============================================
INSERT INTO public.travel_plans (
  user_id,
  title,
  destination,
  days,
  budget,
  travelers,
  preferences,
  start_date,
  summary,
  ai_response
) VALUES (
  '87295353-f192-4908-a899-a6d919d67e2b', -- 请替换为实际用户 ID
  '日本东京 5 日深度游',
  '日本东京',
  5,
  12000.00,
  2,
  ARRAY['美食', '文化', '购物'],
  '2025-11-01',
  '这是一次深度体验东京魅力的旅程。从传统的浅草寺到现代的东京塔，从美味的筑地市场到繁华的银座购物区，您将全方位感受这座城市的独特魅力。行程特别安排了富士山一日游，让您在东京之旅中领略日本的自然之美。',
  '{
    "title": "日本东京 5 日深度游",
    "destination": "日本东京",
    "days": 5,
    "budget": 12000,
    "travelers": 2,
    "preferences": ["美食", "文化", "购物"],
    "start_date": "2025-11-01",
    "summary": "这是一次深度体验东京魅力的旅程。从传统的浅草寺到现代的东京塔，从美味的筑地市场到繁华的银座购物区，您将全方位感受这座城市的独特魅力。行程特别安排了富士山一日游，让您在东京之旅中领略日本的自然之美。",
    "daily_plans": [
      {
        "day": 1,
        "title": "初见东京 - 传统与现代交织",
        "activities": [
          {
            "time": "09:00",
            "title": "浅草寺参拜",
            "location": "浅草寺",
            "address": "东京都台东区浅草2-3-1",
            "longitude": 139.7966,
            "latitude": 35.7148,
            "duration": 120,
            "description": "参观东京最古老的寺庙，感受日本传统文化。在雷门拍照，逛仲见世商店街品尝传统小吃。",
            "estimated_cost": 100,
            "tips": "建议早上前往，游客相对较少，可以抽签求签体验日本文化"
          },
          {
            "time": "12:00",
            "title": "筑地外市场午餐",
            "location": "筑地市场",
            "address": "东京都中央区筑地4丁目",
            "longitude": 139.7707,
            "latitude": 35.6654,
            "duration": 90,
            "description": "品尝最新鲜的海鲜料理和寿司，感受东京的美食文化。",
            "estimated_cost": 300,
            "tips": "推荐尝试海鲜丼和玉子烧，市场9点后人会很多"
          },
          {
            "time": "14:30",
            "title": "东京塔观景",
            "location": "东京塔",
            "address": "东京都港区芝公园4-2-8",
            "longitude": 139.7454,
            "latitude": 35.6586,
            "duration": 120,
            "description": "登上东京地标建筑，360度俯瞰整个东京都市风光。",
            "estimated_cost": 200,
            "tips": "建议傍晚时分前往，可以同时欣赏白天和夜景"
          },
          {
            "time": "18:00",
            "title": "银座购物晚餐",
            "location": "银座",
            "address": "东京都中央区银座",
            "longitude": 139.7640,
            "latitude": 35.6719,
            "duration": 180,
            "description": "在东京最繁华的购物区逛街，享用高级料理晚餐。",
            "estimated_cost": 800,
            "tips": "周末下午会封路变成步行街，逛街更舒适"
          }
        ]
      },
      {
        "day": 2,
        "title": "富士山一日游",
        "activities": [
          {
            "time": "07:00",
            "title": "前往富士山",
            "location": "新宿集合出发",
            "address": "东京都新宿区",
            "longitude": 139.7002,
            "latitude": 35.6895,
            "duration": 120,
            "description": "搭乘旅游巴士前往富士山五合目，途中欣赏日本乡村风光。",
            "estimated_cost": 400,
            "tips": "需提前预订一日游行程，建议选择包含午餐的套餐"
          },
          {
            "time": "10:00",
            "title": "富士山五合目游览",
            "location": "富士山五合目",
            "address": "山梨县南都留郡",
            "longitude": 138.7274,
            "latitude": 35.3606,
            "duration": 120,
            "description": "在富士山半山腰欣赏壮丽景色，参观神社，购买纪念品。",
            "estimated_cost": 150,
            "tips": "注意保暖，山上温度较低，建议带外套"
          },
          {
            "time": "13:00",
            "title": "河口湖游览",
            "location": "河口湖",
            "address": "山梨县南都留郡富士河口湖町",
            "longitude": 138.7634,
            "latitude": 35.5022,
            "duration": 150,
            "description": "在河口湖畔漫步，从不同角度欣赏富士山倒影，品尝当地美食。",
            "estimated_cost": 250,
            "tips": "天气晴朗时可以拍到富士山倒影，非常美"
          },
          {
            "time": "17:00",
            "title": "返回东京",
            "location": "新宿",
            "address": "东京都新宿区",
            "longitude": 139.7002,
            "latitude": 35.6895,
            "duration": 120,
            "description": "搭乘巴士返回东京，晚餐可在新宿享用。",
            "estimated_cost": 200,
            "tips": "巴士上可以休息，准备好第二天的行程"
          }
        ]
      },
      {
        "day": 3,
        "title": "动漫与科技之旅",
        "activities": [
          {
            "time": "10:00",
            "title": "秋叶原电器街",
            "location": "秋叶原",
            "address": "东京都千代田区外神田",
            "longitude": 139.7737,
            "latitude": 35.6984,
            "duration": 150,
            "description": "探索日本动漫、电子产品的圣地，参观女仆咖啡厅，购买手办和电子产品。",
            "estimated_cost": 500,
            "tips": "免税店很多，记得带护照可以退税"
          },
          {
            "time": "13:30",
            "title": "台场未来科技馆",
            "location": "日本科学未来馆",
            "address": "东京都江东区青海2-3-6",
            "longitude": 139.7756,
            "latitude": 35.6191,
            "duration": 120,
            "description": "参观高科技展览，体验最新科技产品，观看机器人表演。",
            "estimated_cost": 100,
            "tips": "周一闭馆，请注意开放时间"
          },
          {
            "time": "16:30",
            "title": "台场海滨公园",
            "location": "台场海滨公园",
            "address": "东京都港区台场1丁目",
            "longitude": 139.7752,
            "latitude": 35.6297,
            "duration": 90,
            "description": "在海滨公园散步，欣赏彩虹大桥和自由女神像复制品。",
            "estimated_cost": 0,
            "tips": "傍晚时分景色最美，可以看到彩虹大桥亮灯"
          },
          {
            "time": "18:30",
            "title": "台场购物中心晚餐",
            "location": "DiverCity Tokyo Plaza",
            "address": "东京都江东区青海1-1-10",
            "longitude": 139.7756,
            "latitude": 35.6249,
            "duration": 120,
            "description": "在大型购物中心享用晚餐，观看等身高达模型。",
            "estimated_cost": 300,
            "tips": "每天特定时间高达会有灯光秀表演"
          }
        ]
      },
      {
        "day": 4,
        "title": "文化艺术日",
        "activities": [
          {
            "time": "09:30",
            "title": "明治神宫参拜",
            "location": "明治神宫",
            "address": "东京都涩谷区代代木神园町1-1",
            "longitude": 139.6993,
            "latitude": 35.6764,
            "duration": 90,
            "description": "参观东京最重要的神社之一，漫步在宁静的森林步道中。",
            "estimated_cost": 0,
            "tips": "运气好可以看到日式婚礼仪式"
          },
          {
            "time": "11:30",
            "title": "原宿竹下通",
            "location": "原宿竹下通",
            "address": "东京都涩谷区神宫前1丁目",
            "longitude": 139.7029,
            "latitude": 35.6702,
            "duration": 120,
            "description": "探索东京最潮流的街区，品尝网红美食，体验日本年轻人文化。",
            "estimated_cost": 250,
            "tips": "必尝彩虹棉花糖和可丽饼"
          },
          {
            "time": "14:00",
            "title": "表参道艺术街",
            "location": "表参道",
            "address": "东京都港区北青山",
            "longitude": 139.7122,
            "latitude": 35.6654,
            "duration": 120,
            "description": "漫步在时尚的表参道，欣赏建筑设计，参观艺术画廊。",
            "estimated_cost": 200,
            "tips": "很多国际品牌旗舰店，建筑设计都很有特色"
          },
          {
            "time": "17:00",
            "title": "涩谷街区探索",
            "location": "涩谷",
            "address": "东京都涩谷区",
            "longitude": 139.7016,
            "latitude": 35.6595,
            "duration": 150,
            "description": "体验世界最繁忙的十字路口，参观涩谷109，感受东京的活力。",
            "estimated_cost": 400,
            "tips": "可以去星巴克二楼俯拍涩谷路口全景"
          }
        ]
      },
      {
        "day": 5,
        "title": "东京深度体验",
        "activities": [
          {
            "time": "09:00",
            "title": "筑地市场海鲜早餐",
            "location": "筑地场外市场",
            "address": "东京都中央区筑地4丁目",
            "longitude": 139.7707,
            "latitude": 35.6654,
            "duration": 90,
            "description": "享用最后一顿丰盛的海鲜早餐，购买日本特产和纪念品。",
            "estimated_cost": 200,
            "tips": "推荐购买干货海产品作为伴手礼"
          },
          {
            "time": "11:00",
            "title": "上野公园散步",
            "location": "上野公园",
            "address": "东京都台东区上野公园",
            "longitude": 139.7738,
            "latitude": 35.7148,
            "duration": 90,
            "description": "在东京最大的公园漫步，如果是春天还能欣赏樱花。",
            "estimated_cost": 0,
            "tips": "公园内有多个博物馆，时间充裕可以参观"
          },
          {
            "time": "13:00",
            "title": "阿美横町购物",
            "location": "阿美横丁商店街",
            "address": "东京都台东区上野",
            "longitude": 139.7753,
            "latitude": 35.7085,
            "duration": 120,
            "description": "在热闹的商店街购买最后的伴手礼和特产。",
            "estimated_cost": 300,
            "tips": "价格相对便宜，适合大量采购伴手礼"
          },
          {
            "time": "16:00",
            "title": "整理行李返程",
            "location": "酒店",
            "address": "东京市区",
            "longitude": 139.7640,
            "latitude": 35.6719,
            "duration": 120,
            "description": "返回酒店整理行李，准备前往机场。",
            "estimated_cost": 0,
            "tips": "提前3小时前往机场办理登机手续"
          }
        ]
      }
    ],
    "accommodation": [
      {
        "day": 1,
        "hotel_name": "东京银座首都酒店",
        "address": "东京都中央区筑地1-2-1",
        "longitude": 139.7699,
        "latitude": 35.6655,
        "price_range": "¥800-1200/晚",
        "rating": "4.5星",
        "reason": "地理位置优越，靠近筑地市场和银座，交通便利，房间舒适整洁"
      },
      {
        "day": 2,
        "hotel_name": "东京银座首都酒店",
        "address": "东京都中央区筑地1-2-1",
        "longitude": 139.7699,
        "latitude": 35.6655,
        "price_range": "¥800-1200/晚",
        "rating": "4.5星",
        "reason": "继续入住，方便第二天一早出发去富士山"
      },
      {
        "day": 3,
        "hotel_name": "台场日航东京酒店",
        "address": "东京都港区台场1-9-1",
        "longitude": 139.7748,
        "latitude": 35.6297,
        "price_range": "¥900-1400/晚",
        "rating": "4.6星",
        "reason": "位于台场海滨，可欣赏东京湾夜景，靠近台场各景点"
      },
      {
        "day": 4,
        "hotel_name": "涩谷东急 REI 酒店",
        "address": "东京都涩谷区涩谷1-24-10",
        "longitude": 139.7016,
        "latitude": 35.6595,
        "price_range": "¥700-1000/晚",
        "rating": "4.3星",
        "reason": "位于涩谷中心，步行可达各主要景点，性价比高"
      },
      {
        "day": 5,
        "hotel_name": "涩谷东急 REI 酒店",
        "address": "东京都涩谷区涩谷1-24-10",
        "longitude": 139.7016,
        "latitude": 35.6595,
        "price_range": "¥700-1000/晚",
        "rating": "4.3星",
        "reason": "最后一晚继续入住，方便整理行李和前往机场"
      }
    ],
    "transportation": {
      "overview": "建议购买西瓜卡(Suica)或PASMO卡用于市内交通，覆盖地铁、JR线和公交。往返机场可选择成田特快或利木津巴士。市内主要依靠地铁和JR山手线，富士山行程建议参加一日游巴士团。",
      "details": [
        {
          "type": "飞机",
          "route": "往返机票（国内-东京成田/羽田）",
          "estimated_cost": 4000
        },
        {
          "type": "机场快线",
          "route": "成田特快 NEX 往返",
          "estimated_cost": 400
        },
        {
          "type": "地铁通票",
          "route": "东京Metro 72小时通票",
          "estimated_cost": 150
        },
        {
          "type": "巴士",
          "route": "富士山一日游包车",
          "estimated_cost": 800
        },
        {
          "type": "西瓜卡",
          "route": "市内交通充值",
          "estimated_cost": 300
        }
      ]
    },
    "budget_breakdown": {
      "transportation": 5650,
      "accommodation": 4500,
      "food": 3000,
      "activities": 2000,
      "shopping": 1500,
      "other": 350,
      "total": 17000
    }
  }'::jsonb
);

-- ============================================
-- 行程 2: 云南大理 4 日休闲游
-- ============================================
INSERT INTO public.travel_plans (
  user_id,
  title,
  destination,
  days,
  budget,
  travelers,
  preferences,
  start_date,
  summary,
  ai_response
) VALUES (
  '87295353-f192-4908-a899-a6d919d67e2b', -- 请替换为实际用户 ID
  '云南大理 4 日休闲游',
  '云南大理',
  4,
  5000.00,
  3,
  ARRAY['自然风光', '古镇', '摄影'],
  '2025-10-15',
  '在苍山洱海之间，感受大理的慢生活。漫步古城石板路，欣赏白族建筑，在洱海边骑行，看日出日落。这是一次远离喧嚣，回归自然的治愈之旅。',
  '{
    "title": "云南大理 4 日休闲游",
    "destination": "云南大理",
    "days": 4,
    "budget": 5000,
    "travelers": 3,
    "preferences": ["自然风光", "古镇", "摄影"],
    "start_date": "2025-10-15",
    "summary": "在苍山洱海之间，感受大理的慢生活。漫步古城石板路，欣赏白族建筑，在洱海边骑行，看日出日落。这是一次远离喧嚣，回归自然的治愈之旅。",
    "daily_plans": [
      {
        "day": 1,
        "title": "初识大理古城",
        "activities": [
          {
            "time": "10:00",
            "title": "抵达大理古城",
            "location": "大理古城",
            "address": "云南省大理白族自治州大理市",
            "longitude": 100.1670,
            "latitude": 25.6920,
            "duration": 60,
            "description": "从大理机场前往古城，办理酒店入住，稍作休整。",
            "estimated_cost": 80,
            "tips": "建议预订古城内的客栈，更有氛围"
          },
          {
            "time": "12:00",
            "title": "古城午餐",
            "location": "大理古城人民路",
            "address": "大理市大理古城人民路",
            "longitude": 100.1670,
            "latitude": 25.6920,
            "duration": 90,
            "description": "品尝白族特色美食：乳扇、饵块、生皮等。",
            "estimated_cost": 120,
            "tips": "推荐再回首凉鸡米线和烤乳扇"
          },
          {
            "time": "14:00",
            "title": "古城漫步",
            "location": "大理古城",
            "address": "五华楼、洋人街区域",
            "longitude": 100.1670,
            "latitude": 25.6920,
            "duration": 180,
            "description": "游览五华楼、洋人街、人民路，感受古城慢生活节奏，参观特色小店。",
            "estimated_cost": 100,
            "tips": "可以租一套白族服装拍照，很出片"
          },
          {
            "time": "18:00",
            "title": "古城夜市",
            "location": "大理古城",
            "address": "复兴路步行街",
            "longitude": 100.1670,
            "latitude": 25.6920,
            "duration": 120,
            "description": "逛古城夜市，品尝小吃，欣赏夜景。",
            "estimated_cost": 80,
            "tips": "晚上古城很美，可以拍照留念"
          }
        ]
      },
      {
        "day": 2,
        "title": "洱海环游",
        "activities": [
          {
            "time": "07:00",
            "title": "才村码头看日出",
            "location": "才村码头",
            "address": "大理市喜洲镇才村",
            "longitude": 100.1450,
            "latitude": 25.7550,
            "duration": 90,
            "description": "在洱海边欣赏日出，拍摄晨曦中的苍山洱海。",
            "estimated_cost": 0,
            "tips": "需要早起，但日出景色非常值得"
          },
          {
            "time": "09:00",
            "title": "洱海骑行",
            "location": "洱海生态廊道",
            "address": "大理市环海西路",
            "longitude": 100.1800,
            "latitude": 25.7800,
            "duration": 240,
            "description": "租电动车或自行车环洱海骑行，途经喜洲古镇、海舌公园等景点。",
            "estimated_cost": 150,
            "tips": "建议租电动车，省力且可以骑更远"
          },
          {
            "time": "13:00",
            "title": "喜洲古镇午餐",
            "location": "喜洲古镇",
            "address": "大理市喜洲镇",
            "longitude": 100.1240,
            "latitude": 25.7970,
            "duration": 90,
            "description": "品尝喜洲粑粑和白族特色菜肴。",
            "estimated_cost": 100,
            "tips": "喜洲粑粑现烤的最好吃"
          },
          {
            "time": "15:00",
            "title": "海舌公园游览",
            "location": "海舌生态公园",
            "address": "大理市喜洲镇金河村",
            "longitude": 100.1340,
            "latitude": 25.8150,
            "duration": 120,
            "description": "在伸入洱海的半岛上漫步，拍摄美丽的洱海风光。",
            "estimated_cost": 30,
            "tips": "下午光线好，适合拍照，有很多网红拍照点"
          },
          {
            "time": "18:00",
            "title": "返回古城晚餐",
            "location": "大理古城",
            "address": "大理古城",
            "longitude": 100.1670,
            "latitude": 25.6920,
            "duration": 120,
            "description": "返回古城，在特色餐厅享用晚餐。",
            "estimated_cost": 150,
            "tips": "可以选择院子里的餐厅，环境很好"
          }
        ]
      },
      {
        "day": 3,
        "title": "苍山探险",
        "activities": [
          {
            "time": "08:30",
            "title": "苍山大索道",
            "location": "苍山",
            "address": "大理市苍山国家地质公园",
            "longitude": 100.1000,
            "latitude": 25.6900,
            "duration": 150,
            "description": "乘坐索道上苍山，俯瞰洱海全景，游览洗马潭。",
            "estimated_cost": 280,
            "tips": "山上温度低，记得带外套"
          },
          {
            "time": "12:00",
            "title": "山间午餐",
            "location": "苍山中和寺",
            "address": "苍山半山腰",
            "longitude": 100.1100,
            "latitude": 25.6850,
            "duration": 60,
            "description": "在山间餐厅享用简餐。",
            "estimated_cost": 80,
            "tips": "山上选择不多，建议自带零食"
          },
          {
            "time": "14:00",
            "title": "玉带云游路徒步",
            "location": "苍山玉带路",
            "address": "苍山半山腰",
            "longitude": 100.1100,
            "latitude": 25.6850,
            "duration": 120,
            "description": "沿着苍山半山腰的玉带路徒步，欣赏山林风光。",
            "estimated_cost": 0,
            "tips": "穿舒适的运动鞋，路程较长"
          },
          {
            "time": "17:00",
            "title": "返回古城",
            "location": "大理古城",
            "address": "大理古城",
            "longitude": 100.1670,
            "latitude": 25.6920,
            "duration": 90,
            "description": "下山返回古城，休息调整。",
            "estimated_cost": 50,
            "tips": "索道下山较快，注意时间安排"
          },
          {
            "time": "19:00",
            "title": "古城特色晚餐",
            "location": "大理古城",
            "address": "大理古城人民路",
            "longitude": 100.1670,
            "latitude": 25.6920,
            "duration": 120,
            "description": "品尝大理特色火锅或石板烧烤。",
            "estimated_cost": 180,
            "tips": "推荐尝试酸菜鱼火锅"
          }
        ]
      },
      {
        "day": 4,
        "title": "双廊小镇与返程",
        "activities": [
          {
            "time": "08:00",
            "title": "前往双廊",
            "location": "双廊古镇",
            "address": "大理市双廊镇",
            "longitude": 100.1920,
            "latitude": 25.8530,
            "duration": 90,
            "description": "驱车前往洱海东岸的双廊古镇。",
            "estimated_cost": 100,
            "tips": "可以包车或拼车前往"
          },
          {
            "time": "10:00",
            "title": "双廊古镇游览",
            "location": "双廊古镇",
            "address": "大理市双廊镇",
            "longitude": 100.1920,
            "latitude": 25.8530,
            "duration": 150,
            "description": "游览双廊古镇，参观南诏风情岛，在洱海边的咖啡厅休憩。",
            "estimated_cost": 120,
            "tips": "双廊很小，适合慢慢逛，拍照很美"
          },
          {
            "time": "13:00",
            "title": "海景午餐",
            "location": "双廊海景餐厅",
            "address": "双廊镇洱海边",
            "longitude": 100.1920,
            "latitude": 25.8530,
            "duration": 90,
            "description": "在洱海边的餐厅享用午餐，欣赏海景。",
            "estimated_cost": 150,
            "tips": "选择靠窗位置，边吃边看洱海"
          },
          {
            "time": "15:00",
            "title": "返回大理",
            "location": "大理古城/机场",
            "address": "大理市",
            "longitude": 100.1670,
            "latitude": 25.6920,
            "duration": 120,
            "description": "返回大理古城或直接前往机场，结束愉快的大理之旅。",
            "estimated_cost": 80,
            "tips": "提前安排好交通，预留足够时间"
          }
        ]
      }
    ],
    "accommodation": [
      {
        "day": 1,
        "hotel_name": "大理古城院子客栈",
        "address": "大理市大理古城人民路下段",
        "longitude": 100.1670,
        "latitude": 25.6920,
        "price_range": "¥300-500/晚",
        "rating": "4.7星",
        "reason": "白族特色庭院设计，位于古城中心，步行可达主要景点"
      },
      {
        "day": 2,
        "hotel_name": "大理古城院子客栈",
        "address": "大理市大理古城人民路下段",
        "longitude": 100.1670,
        "latitude": 25.6920,
        "price_range": "¥300-500/晚",
        "rating": "4.7星",
        "reason": "继续入住，方便第二天出行"
      },
      {
        "day": 3,
        "hotel_name": "洱海海景度假酒店",
        "address": "大理市海东镇",
        "longitude": 100.2200,
        "latitude": 25.7500,
        "price_range": "¥400-600/晚",
        "rating": "4.6星",
        "reason": "面朝洱海，可以在房间看日出，环境优美"
      },
      {
        "day": 4,
        "hotel_name": "双廊海景客栈",
        "address": "大理市双廊镇",
        "longitude": 100.1920,
        "latitude": 25.8530,
        "price_range": "¥350-550/晚",
        "rating": "4.5星",
        "reason": "位于双廊镇中心，海景房，最后一晚好好享受"
      }
    ],
    "transportation": {
      "overview": "建议飞机往返大理，市内出行主要靠包车、租车或电动车。大理古城较小，步行即可游览。洱海环游建议租电动车，苍山可乘坐索道。",
      "details": [
        {
          "type": "飞机",
          "route": "往返机票（国内-大理机场）",
          "estimated_cost": 2000
        },
        {
          "type": "机场巴士",
          "route": "机场往返古城",
          "estimated_cost": 80
        },
        {
          "type": "电动车租赁",
          "route": "洱海环游",
          "estimated_cost": 200
        },
        {
          "type": "索道",
          "route": "苍山大索道往返",
          "estimated_cost": 280
        },
        {
          "type": "包车",
          "route": "市内包车游览",
          "estimated_cost": 300
        }
      ]
    },
    "budget_breakdown": {
      "transportation": 2860,
      "accommodation": 1600,
      "food": 1200,
      "activities": 600,
      "shopping": 400,
      "other": 340,
      "total": 7000
    }
  }'::jsonb
);

-- ============================================
-- 行程 3: 成都美食 3 日游
-- ============================================
INSERT INTO public.travel_plans (
  user_id,
  title,
  destination,
  days,
  budget,
  travelers,
  preferences,
  start_date,
  summary,
  ai_response
) VALUES (
  '87295353-f192-4908-a899-a6d919d67e2b', -- 请替换为实际用户 ID
  '成都美食探索 3 日游',
  '四川成都',
  3,
  3500.00,
  2,
  ARRAY['美食', '熊猫', '文化'],
  '2025-12-01',
  '这是一场舌尖上的成都之旅。从传统的火锅、串串到精致的川菜，从街边小吃到网红餐厅，全方位品尝成都美食。同时探访大熊猫基地，感受成都的悠闲文化，体验最地道的巴蜀风情。',
  '{
    "title": "成都美食探索 3 日游",
    "destination": "四川成都",
    "days": 3,
    "budget": 3500,
    "travelers": 2,
    "preferences": ["美食", "熊猫", "文化"],
    "start_date": "2025-12-01",
    "summary": "这是一场舌尖上的成都之旅。从传统的火锅、串串到精致的川菜，从街边小吃到网红餐厅，全方位品尝成都美食。同时探访大熊猫基地，感受成都的悠闲文化,体验最地道的巴蜀风情。",
    "daily_plans": [
      {
        "day": 1,
        "title": "市区美食与文化探索",
        "activities": [
          {
            "time": "10:00",
            "title": "宽窄巷子",
            "location": "宽窄巷子",
            "address": "成都市青羊区金河路口宽窄巷子",
            "longitude": 104.0557,
            "latitude": 30.6733,
            "duration": 150,
            "description": "游览成都最具代表性的历史文化街区，品尝各种成都小吃。",
            "estimated_cost": 150,
            "tips": "推荐尝试三大炮、糖油果子、钵钵鸡"
          },
          {
            "time": "13:00",
            "title": "蜀九香火锅午餐",
            "location": "蜀九香火锅",
            "address": "成都市武侯区",
            "longitude": 104.0633,
            "latitude": 30.6415,
            "duration": 120,
            "description": "品尝地道的成都火锅，体验麻辣鲜香。",
            "estimated_cost": 200,
            "tips": "推荐点鸳鸯锅，必点毛肚和黄喉"
          },
          {
            "time": "15:30",
            "title": "人民公园喝茶",
            "location": "人民公园",
            "address": "成都市青羊区少城路12号",
            "longitude": 104.0630,
            "latitude": 30.6726,
            "duration": 120,
            "description": "在鹤鸣茶社体验成都的茶文化，享受慢生活。",
            "estimated_cost": 50,
            "tips": "可以体验采耳服务，很舒服"
          },
          {
            "time": "18:00",
            "title": "锦里古街夜游",
            "location": "锦里古街",
            "address": "成都市武侯区武侯祠大街231号",
            "longitude": 104.0490,
            "latitude": 30.6450,
            "duration": 150,
            "description": "游览锦里夜市，品尝各种四川小吃和特色美食。",
            "estimated_cost": 120,
            "tips": "晚上灯光很美,推荐尝试伤心凉粉、叶儿耙"
          }
        ]
      },
      {
        "day": 2,
        "title": "熊猫基地与春熙路",
        "activities": [
          {
            "time": "08:00",
            "title": "大熊猫繁育研究基地",
            "location": "成都大熊猫繁育研究基地",
            "address": "成都市成华区熊猫大道1375号",
            "longitude": 104.1493,
            "latitude": 30.7347,
            "duration": 180,
            "description": "近距离观看可爱的大熊猫，了解熊猫保护知识。",
            "estimated_cost": 80,
            "tips": "早上去熊猫最活跃，记得提前在官网预约门票"
          },
          {
            "time": "12:00",
            "title": "东郊记忆午餐",
            "location": "东郊记忆",
            "address": "成都市成华区建设南路中段4号",
            "longitude": 104.1325,
            "latitude": 30.6850,
            "duration": 120,
            "description": "在工业风创意园区品尝特色餐饮。",
            "estimated_cost": 100,
            "tips": "适合拍照,有很多创意餐厅和咖啡厅"
          },
          {
            "time": "14:30",
            "title": "太古里购物",
            "location": "成都远洋太古里",
            "address": "成都市锦江区中纱帽街8号",
            "longitude": 104.0861,
            "latitude": 30.6566,
            "duration": 150,
            "description": "逛成都最时尚的购物街区，打卡网红店。",
            "estimated_cost": 200,
            "tips": "建筑很有特色,方所书店值得一去"
          },
          {
            "time": "17:30",
            "title": "春熙路步行街",
            "location": "春熙路",
            "address": "成都市锦江区春熙路",
            "longitude": 104.0811,
            "latitude": 30.6600,
            "duration": 120,
            "description": "游览成都最繁华的商业街，打卡IFS熊猫。",
            "estimated_cost": 100,
            "tips": "IFS楼顶的爬墙熊猫是必打卡点"
          },
          {
            "time": "19:30",
            "title": "川菜博物馆晚餐",
            "location": "川菜博物馆",
            "address": "成都市郫都区古城镇",
            "longitude": 103.8873,
            "latitude": 30.8087,
            "duration": 150,
            "description": "在川菜博物馆学习川菜文化,品尝正宗川菜。",
            "estimated_cost": 250,
            "tips": "需要提前预约,可以参与川菜制作体验"
          }
        ]
      },
      {
        "day": 3,
        "title": "武侯祠与美食收官",
        "activities": [
          {
            "time": "09:00",
            "title": "武侯祠",
            "location": "武侯祠博物馆",
            "address": "成都市武侯区武侯祠大街231号",
            "longitude": 104.0490,
            "latitude": 30.6450,
            "duration": 120,
            "description": "参观三国文化圣地,了解诸葛亮和刘备的故事。",
            "estimated_cost": 60,
            "tips": "可以请讲解员,更能了解历史文化"
          },
          {
            "time": "11:30",
            "title": "文殊院素斋",
            "location": "文殊院",
            "address": "成都市青羊区文殊院街66号",
            "longitude": 104.0730,
            "latitude": 30.6800,
            "duration": 90,
            "description": "在文殊院品尝精致的素斋,感受禅意文化。",
            "estimated_cost": 80,
            "tips": "素斋很有特色,性价比高"
          },
          {
            "time": "13:30",
            "title": "玉林生活广场",
            "location": "玉林",
            "address": "成都市武侯区玉林",
            "longitude": 104.0550,
            "latitude": 30.6300,
            "duration": 120,
            "description": "探访《成都》歌曲中的玉林小酒馆,感受成都的文艺气息。",
            "estimated_cost": 100,
            "tips": "小酒馆需要排队,可以先在周边逛逛"
          },
          {
            "time": "16:00",
            "title": "建设路小吃街",
            "location": "建设路",
            "address": "成都市成华区建设路",
            "longitude": 104.1200,
            "latitude": 30.6700,
            "duration": 120,
            "description": "在成都著名的小吃街扫街,品尝各种地道小吃。",
            "estimated_cost": 150,
            "tips": "推荐冒椒火辣、蛋烘糕、烤脑花"
          },
          {
            "time": "18:30",
            "title": "串串香收官",
            "location": "玉林串串香",
            "address": "成都市武侯区",
            "longitude": 104.0550,
            "latitude": 30.6300,
            "duration": 90,
            "description": "用一顿地道的串串香结束成都美食之旅。",
            "estimated_cost": 120,
            "tips": "记得要冰粉作为甜点,解辣神器"
          }
        ]
      }
    ],
    "accommodation": [
      {
        "day": 1,
        "hotel_name": "成都宽窄巷子亚朵酒店",
        "address": "成都市青羊区长顺上街127号",
        "longitude": 104.0557,
        "latitude": 30.6733,
        "price_range": "¥400-600/晚",
        "rating": "4.6星",
        "reason": "位于宽窄巷子附近,交通便利,房间舒适,早餐丰富"
      },
      {
        "day": 2,
        "hotel_name": "成都春熙路IFS全季酒店",
        "address": "成都市锦江区红星路三段1号",
        "longitude": 104.0811,
        "latitude": 30.6600,
        "price_range": "¥450-650/晚",
        "rating": "4.5星",
        "reason": "位于市中心春熙路,购物方便,地铁直达"
      },
      {
        "day": 3,
        "hotel_name": "成都春熙路IFS全季酒店",
        "address": "成都市锦江区红星路三段1号",
        "longitude": 104.0811,
        "latitude": 30.6600,
        "price_range": "¥450-650/晚",
        "rating": "4.5星",
        "reason": "最后一晚继续入住,方便前往机场"
      }
    ],
    "transportation": {
      "overview": "成都市内交通便利,地铁覆盖主要景点。建议办理天府通卡或使用手机NFC支付。出租车和网约车价格合理。熊猫基地等郊区景点可选择地铁+公交或打车。",
      "details": [
        {
          "type": "飞机",
          "route": "往返机票（国内-成都双流/天府机场）",
          "estimated_cost": 1500
        },
        {
          "type": "机场大巴",
          "route": "机场往返市区",
          "estimated_cost": 60
        },
        {
          "type": "地铁",
          "route": "市内地铁出行",
          "estimated_cost": 50
        },
        {
          "type": "出租车",
          "route": "景点间打车",
          "estimated_cost": 150
        },
        {
          "type": "公交",
          "route": "熊猫基地公交",
          "estimated_cost": 10
        }
      ]
    },
    "budget_breakdown": {
      "transportation": 1770,
      "accommodation": 1500,
      "food": 1420,
      "activities": 290,
      "shopping": 300,
      "other": 220,
      "total": 5500
    }
  }'::jsonb
);

-- ============================================
-- 添加示例支出记录
-- ============================================
-- 注意：这里使用的 plan_id 需要在插入后从上面的行程中获取
-- 可以通过以下查询获取刚插入的行程ID：
-- SELECT id, title FROM public.travel_plans WHERE user_id = '87295353-f192-4908-a899-a6d919d67e2b' ORDER BY created_at DESC LIMIT 3;

-- ============================================
-- 行程 4: 上海动漫美食 3 日体验游
-- ============================================
INSERT INTO public.travel_plans (
  user_id,
  title,
  destination,
  days,
  budget,
  travelers,
  preferences,
  start_date,
  summary,
  ai_response
) VALUES (
  '87295353-f192-4908-a899-a6d919d67e2b', -- 请替换为实际用户 ID
  '上海动漫美食3日体验游',
  '上海',
  3,
  6000.00,
  2,
  ARRAY['美食', '动漫', '文化'],
  '2025-11-04',
  '本次行程聚焦上海人民广场及周边区域，融合地道美食与动漫文化体验。从黄河路老字号到南京路潮流火锅，从百联ZX创趣场到豫园动漫商店，让您在三天内深度感受上海的市井烟火与二次元魅力。',
  '{
    "title": "上海动漫美食3日体验游",
    "destination": "上海",
    "days": 3,
    "budget": 6000,
    "travelers": 2,
    "preferences": ["美食", "动漫", "文化"],
    "start_date": "2025-11-04",
    "summary": "本次行程聚焦上海人民广场及周边区域，融合地道美食与动漫文化体验。从黄河路老字号到南京路潮流火锅，从百联ZX创趣场到豫园动漫商店，让您在三天内深度感受上海的市井烟火与二次元魅力。",
    "daily_plans": [
      {
        "day": 1,
        "title": "人民广场美食初探+动漫地标打卡",
        "activities": [
          {
            "time": "11:00",
            "title": "黄河路美食休闲街午餐",
            "location": "黄河路美食休闲栈",
            "address": "南京西路258号2楼(人民广场地铁站9号口步行60米)",
            "longitude": 121.4787,
            "latitude": 31.2333,
            "duration": 90,
            "description": "漫步上海老牌美食街，品尝本帮菜和各地风味小吃，感受老上海烟火气。",
            "estimated_cost": 200,
            "tips": "推荐尝试红烧肉、蟹粉小笼等经典菜品，避开12:30用餐高峰"
          },
          {
            "time": "13:00",
            "title": "Toei Animation东映动画探店",
            "location": "Toei Animation东映动画(百联ZX店)",
            "address": "南京东路340号百联ZX创趣场2层(南京东路地铁站1号口旁)",
            "longitude": 121.4808,
            "latitude": 31.2376,
            "duration": 120,
            "description": "探访东映官方授权店，收集《龙珠》《海贼王》《美少女战士》等经典IP周边。",
            "estimated_cost": 500,
            "tips": "店内常有限定商品发售，建议关注官方公告提前准备"
          },
          {
            "time": "15:30",
            "title": "费大厨辣椒炒肉晚餐",
            "location": "费大厨辣椒炒肉(人广来福士店)",
            "address": "上海城区西藏中路268号费大厨辣椒炒肉",
            "longitude": 121.4803,
            "latitude": 31.2338,
            "duration": 90,
            "description": "品尝湖南人气连锁餐厅招牌菜辣椒炒肉，体验地道湘味。",
            "estimated_cost": 180,
            "tips": "辣椒炒肉每日限量，建议早点前往以免售罄"
          },
          {
            "time": "17:30",
            "title": "自由探索百联ZX",
            "location": "百联ZX创趣场",
            "address": "南京东路340号",
            "longitude": 121.4808,
            "latitude": 31.2376,
            "duration": 120,
            "description": "继续探索这座二次元主题商场，打卡其他动漫品牌店铺。",
            "estimated_cost": 300,
            "tips": "商场内多家店铺可集章兑换礼品，记得领取打卡手册"
          }
        ]
      },
      {
        "day": 2,
        "title": "南京路美食盛宴+动漫手办收藏",
        "activities": [
          {
            "time": "11:00",
            "title": "海底捞火锅午餐",
            "location": "海底捞火锅(世茂广场店)",
            "address": "南京东路789号世茂广场西区8层",
            "longitude": 121.4863,
            "latitude": 31.2385,
            "duration": 120,
            "description": "享受知名火锅品牌优质服务，自选调料和小吃，体验热闹聚餐氛围。",
            "estimated_cost": 300,
            "tips": "可体验拉面表演和美甲服务，建议错峰前往减少排队"
          },
          {
            "time": "13:30",
            "title": "耶里夏丽新疆风味",
            "location": "耶里夏丽(世茂广场店)",
            "address": "南京东路829号上海世茂广场L5层西区L502",
            "longitude": 121.4857,
            "latitude": 31.2386,
            "duration": 90,
            "description": "品尝正宗新疆菜，感受异域风情，推荐馕坑烤肉和手工酸奶。",
            "estimated_cost": 220,
            "tips": "餐厅装修极具民族特色，适合拍照打卡"
          },
          {
            "time": "15:00",
            "title": "樱动漫手办淘货",
            "location": "樱动漫手办",
            "address": "百米香榭1层125号(人民广场地铁站14号口步行350米)",
            "longitude": 121.4819,
            "latitude": 31.2353,
            "duration": 90,
            "description": "探访本地知名手办专卖店，寻找心仪动漫模型和限定商品。",
            "estimated_cost": 600,
            "tips": "可请店员推荐近期热门新品，注意辨别正版与盗版"
          },
          {
            "time": "17:00",
            "title": "很久以前羊肉串晚餐",
            "location": "很久以前羊肉串(南京路第一百货店)",
            "address": "南京东路830号第一百货商业中心B馆6楼",
            "longitude": 121.4853,
            "latitude": 31.2388,
            "duration": 120,
            "description": "品尝网红烧烤连锁店特色羊肉串，搭配秘制蘸料，享受夜宵乐趣。",
            "estimated_cost": 280,
            "tips": "烤鸡翅和腰子也备受好评，建议多人分享多种口味"
          }
        ]
      },
      {
        "day": 3,
        "title": "豫园传统文化+动漫购物之旅",
        "activities": [
          {
            "time": "10:00",
            "title": "超能动漫豫园店探秘",
            "location": "超能动漫(豫园商城店)",
            "address": "旧校场路69号(豫园地铁站7号口步行390米)",
            "longitude": 121.4912,
            "latitude": 31.2292,
            "duration": 120,
            "description": "在古典园林商圈中寻找动漫宝藏，购买特色文创产品。",
            "estimated_cost": 400,
            "tips": "店铺位于豫园商城内，可顺道游览九曲桥和湖心亭"
          },
          {
            "time": "12:30",
            "title": "Ministry Of Crab午餐",
            "location": "Ministry Of Crab(人民公园店)",
            "address": "南京西路231号人民公园内(芭芭露莎一楼)",
            "longitude": 121.4762,
            "latitude": 31.2329,
            "duration": 120,
            "description": "在人民公园内的高端餐厅享用斯里兰卡风味螃蟹料理，环境优雅宁静。",
            "estimated_cost": 800,
            "tips": "需提前预订窗边位，可欣赏公园绿景"
          },
          {
            "time": "15:00",
            "title": "老瑞福上海菜怀旧体验",
            "location": "老瑞福上海菜(人民广场店)",
            "address": "凤阳路238号(黄河路路口)",
            "longitude": 121.4788,
            "latitude": 31.2327,
            "duration": 90,
            "description": "品味传统本帮菜，感受老上海家庭餐馆的独特情怀。",
            "estimated_cost": 240,
            "tips": "响油鳝糊和八宝鸭是招牌菜，分量足适合分享"
          },
          {
            "time": "17:00",
            "title": "毒蛇面馆收尾",
            "location": "毒蛇面馆(人民广场店)",
            "address": "广西北路235号1层B座-2",
            "longitude": 121.4797,
            "latitude": 31.2332,
            "duration": 60,
            "description": "以一碗地道上海风味面结束旅程，回味城市独特味道。",
            "estimated_cost": 80,
            "tips": "推荐辣肉面和雪菜肉丝面，出餐快适合短暂停留"
          }
        ]
      }
    ],
    "accommodation": [
      {
        "day": 1,
        "hotel_name": "上海明天广场JW万豪酒店",
        "address": "南京西路399号(人民广场地铁站11号口步行240米)",
        "longitude": 121.4786,
        "latitude": 31.2338,
        "price_range": "¥900-1300/晚",
        "rating": "5星",
        "reason": "地理位置优越，紧邻人民广场，交通便利，设施完善，服务优质"
      },
      {
        "day": 2,
        "hotel_name": "上海明天广场JW万豪酒店",
        "address": "南京西路399号(人民广场地铁站11号口步行240米)",
        "longitude": 121.4786,
        "latitude": 31.2338,
        "price_range": "¥900-1300/晚",
        "rating": "5星",
        "reason": "连续入住方便行李存放，节省换房时间，便于继续探索市区"
      },
      {
        "day": 3,
        "hotel_name": "上海明天广场JW万豪酒店",
        "address": "南京西路399号(人民广场地铁站11号口步行240米)",
        "longitude": 121.4786,
        "latitude": 31.2338,
        "price_range": "¥900-1300/晚",
        "rating": "5星",
        "reason": "最后一晚入住确保充足休息，便于次日返程"
      }
    ],
    "transportation": {
      "overview": "全程以地铁和步行为主，主要活动区域集中在人民广场、南京东路和豫园，均在地铁沿线。建议购买上海公共交通卡或使用手机NFC功能，方便快捷。",
      "details": [
        {
          "type": "飞机",
          "route": "往返机票（根据出发地）",
          "estimated_cost": 2000
        },
        {
          "type": "地铁",
          "route": "上海市内交通（3天）",
          "estimated_cost": 50
        },
        {
          "type": "出租车",
          "route": "应急短途接驳",
          "estimated_cost": 100
        },
        {
          "type": "共享单车",
          "route": "短距离灵活出行",
          "estimated_cost": 30
        }
      ]
    },
    "budget_breakdown": {
      "transportation": 2180,
      "accommodation": 3300,
      "food": 3200,
      "activities": 1900,
      "shopping": 1500,
      "other": 200,
      "total": 12280
    }
  }'::jsonb
);

-- ============================================
-- 完成
-- ============================================
-- 测试数据添加完成！
-- 现已包含 4 条行程数据：
-- 1. 日本东京 5 日深度游
-- 2. 云南大理 4 日休闲游
-- 3. 成都美食探索 3 日游
-- 4. 上海动漫美食 3 日体验游
--
-- 请记得将 '87295353-f192-4908-a899-a6d919d67e2b' 替换为实际的用户 ID

