-- ============================================
-- 上海动漫美食3日体验游
-- ============================================
-- 注意：请将 'YOUR_USER_ID' 替换为实际的用户 ID
-- 可以通过以下 SQL 查询当前用户 ID：
-- SELECT auth.uid();

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
  'YOUR_USER_ID', -- 请替换为实际用户 ID
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
          "tips": "推荐尝试红烧肉、蟹粉小笼等经典菜品，避开12:30用餐高峰",
          "photo": "https://aos-comment.amap.com/B00156NA7N/comment/d9844548c30b5ca6ec0deb526cd9d0b9_2048_2048_80.jpg"
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
          "tips": "店内常有限定商品发售，建议关注官方公告提前准备",
          "photo": "http://store.is.autonavi.com/showpic/a401168b61384b9c2e9a42d396e74e8b"
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
          "tips": "辣椒炒肉每日限量，建议早点前往以免售罄",
          "photo": "http://store.is.autonavi.com/showpic/7d6e2626a8c4aa9dd8781b58544daf71"
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
          "tips": "商场内多家店铺可集章兑换礼品，记得领取打卡手册",
          "photo": "http://store.is.autonavi.com/showpic/a401168b61384b9c2e9a42d396e74e8b"
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
          "tips": "可体验拉面表演和美甲服务，建议错峰前往减少排队",
          "photo": "https://store.is.autonavi.com/showpic/bcb84a02dd0ebb388d01c309af554414?operate=original"
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
          "tips": "餐厅装修极具民族特色，适合拍照打卡",
          "photo": "http://store.is.autonavi.com/showpic/845823df610ae2ab327c71ea0efa3d46"
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
          "tips": "可请店员推荐近期热门新品，注意辨别正版与盗版",
          "photo": "https://aos-comment.amap.com/B0JBUZ7A5P/headerImg/1883d869e1e1190f19ee1e79594ad9f6_2048_2048_80.jpg"
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
          "tips": "烤鸡翅和腰子也备受好评，建议多人分享多种口味",
          "photo": "https://store.is.autonavi.com/showpic/f6958825a0772ef7dd8efd57145ec03a"
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
          "tips": "店铺位于豫园商城内，可顺道游览九曲桥和湖心亭",
          "photo": "https://aos-comment.amap.com/B00156GLDV/comment/8cb604ed7ec7adc657d5bfb96fadc9ed_2048_2048_80.jpg"
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
          "tips": "需提前预订窗边位，可欣赏公园绿景",
          "photo": "http://store.is.autonavi.com/showpic/ccf84123c230340b7b65e29caf62414d"
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
          "tips": "响油鳝糊和八宝鸭是招牌菜，分量足适合分享",
          "photo": "https://aos-comment.amap.com/B0FFFWV1JJ/comment/0645915a514d55ffab5c95bf16e80862_2048_2048_80.jpg"
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
          "tips": "推荐辣肉面和雪菜肉丝面，出餐快适合短暂停留",
          "photo": "http://store.is.autonavi.com/showpic/abf17e125eafc7cbef04f4607f9b6258"
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
        "reason": "地理位置优越，紧邻人民广场，交通便利，设施完善，服务优质",
        "photo": "https://store.is.autonavi.com/showpic/43e01742a332cadb2cbda5ed946798c9"
      },
      {
        "day": 2,
        "hotel_name": "上海明天广场JW万豪酒店",
        "address": "南京西路399号(人民广场地铁站11号口步行240米)",
        "longitude": 121.4786,
        "latitude": 31.2338,
        "price_range": "¥900-1300/晚",
        "rating": "5星",
        "reason": "连续入住方便行李存放，节省换房时间，便于继续探索市区",
        "photo": "https://store.is.autonavi.com/showpic/43e01742a332cadb2cbda5ed946798c9"
      },
      {
        "day": 3,
        "hotel_name": "上海明天广场JW万豪酒店",
        "address": "南京西路399号(人民广场地铁站11号口步行240米)",
        "longitude": 121.4786,
        "latitude": 31.2338,
        "price_range": "¥900-1300/晚",
        "rating": "5星",
        "reason": "最后一晚入住确保充足休息，便于次日返程",
        "photo": "https://store.is.autonavi.com/showpic/43e01742a332cadb2cbda5ed946798c9"
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
-- 执行说明
-- ============================================
-- 1. 查询当前登录用户的 ID：
--    SELECT auth.uid();
--
-- 2. 将上面的 'YOUR_USER_ID' 替换为实际的用户 ID
--
-- 3. 在 Supabase SQL Editor 中执行此脚本
--
-- 4. 执行成功后，可以通过以下查询验证：
--    SELECT id, title, destination, days FROM public.travel_plans 
--    WHERE title = '上海动漫美食3日体验游';

