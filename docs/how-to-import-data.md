# 如何导入行程数据到 Supabase

## 方法一：导入单个行程（上海动漫美食游）

### 步骤 1：获取用户 ID

1. 登录到 [Supabase 控制台](https://app.supabase.com/)
2. 选择你的项目
3. 点击左侧菜单的 **SQL Editor**
4. 执行以下查询获取当前用户 ID：

```sql
SELECT auth.uid();
```

或者查看所有用户：

```sql
SELECT id, email FROM auth.users;
```

复制你想要添加行程的用户 ID。

### 步骤 2：执行 SQL 脚本

1. 打开文件 `docs/shanghai-anime-trip.sql`
2. 将文件中的 `YOUR_USER_ID` 替换为步骤 1 中获取的用户 ID
3. 在 Supabase SQL Editor 中粘贴并执行整个脚本
4. 等待执行完成

### 步骤 3：验证数据

执行以下查询验证数据是否导入成功：

```sql
SELECT id, title, destination, days, budget 
FROM public.travel_plans 
WHERE title = '上海动漫美食3日体验游';
```

## 方法二：导入所有测试数据（推荐）

### 包含的行程

使用 `docs/seed-data.sql` 可以一次性导入 4 条完整的测试行程：

1. 🗾 **日本东京 5 日深度游** - 预算 ¥12,000
2. 🏔️ **云南大理 4 日休闲游** - 预算 ¥5,000
3. 🐼 **四川成都 3 日美食游** - 预算 ¥3,500
4. 🏙️ **上海动漫美食 3 日体验游** - 预算 ¥6,000

### 导入步骤

1. 获取用户 ID（参考方法一步骤 1）
2. 打开 `docs/seed-data.sql`
3. **全局替换** `87295353-f192-4908-a899-a6d919d67e2b` 为你的用户 ID
   - 在编辑器中使用查找替换功能（Ctrl+H 或 Cmd+H）
   - 确保替换所有出现的地方（共 4 处）
4. 在 Supabase SQL Editor 中执行整个脚本
5. 等待执行完成

### 验证数据

```sql
SELECT id, title, destination, days, budget, start_date 
FROM public.travel_plans 
ORDER BY created_at DESC 
LIMIT 10;
```

应该能看到 4 条新添加的行程记录。

## 行程数据特点

### 上海动漫美食 3 日游

✅ **完整的经纬度信息**：所有景点和酒店都包含准确的经纬度坐标  
✅ **真实地址**：基于上海人民广场及周边实际地点  
✅ **详细活动安排**：每天 4 个精心安排的活动  
✅ **特色主题**：融合美食、动漫文化、购物体验  

**行程亮点**：
- 🍜 黄河路美食街、海底捞、Ministry Of Crab 等多样美食
- 🎌 东映动画官方店、樱动漫手办店、豫园动漫商城
- 🏨 全程入住人民广场 JW 万豪酒店（5星）
- 🚇 交通便利，主要依靠地铁出行

**地图展示**：
- 所有景点都有经纬度，可在高德地图上完美显示
- 每日行程路线清晰可见
- 点击标记可查看详细信息

## 常见问题

### Q1: 如何获取我自己的用户 ID？

**方法 1**：在应用中登录后，打开浏览器控制台（F12），执行：
```javascript
console.log(localStorage.getItem('supabase.auth.token'))
```

**方法 2**：在 Supabase SQL Editor 中执行：
```sql
SELECT id, email, created_at FROM auth.users;
```

### Q2: 导入后看不到数据？

确认以下几点：
1. ✅ 用户 ID 替换正确
2. ✅ SQL 执行没有报错
3. ✅ 在应用中使用正确的账号登录
4. ✅ 刷新页面重新加载数据

### Q3: 可以修改行程数据吗？

可以！导入后的数据可以通过以下方式修改：

**在 Supabase 控制台**：
1. 进入 Table Editor
2. 选择 `travel_plans` 表
3. 找到对应记录并编辑

**通过 SQL**：
```sql
UPDATE public.travel_plans 
SET budget = 7000, 
    summary = '你的新描述' 
WHERE title = '上海动漫美食3日体验游';
```

### Q4: 如何删除测试数据？

```sql
-- 删除特定行程
DELETE FROM public.travel_plans 
WHERE title = '上海动漫美食3日体验游';

-- 删除所有测试行程
DELETE FROM public.travel_plans 
WHERE user_id = '你的用户ID';
```

⚠️ **警告**：删除操作不可恢复，请谨慎使用！

## 自定义行程数据

如果你想创建自己的行程数据，请参考以下 JSON 格式：

```json
{
  "title": "行程标题",
  "destination": "目的地",
  "days": 3,
  "budget": 6000,
  "travelers": 2,
  "preferences": ["标签1", "标签2"],
  "start_date": "2025-11-04",
  "summary": "行程简介...",
  "daily_plans": [...],
  "accommodation": [...],
  "transportation": {...},
  "budget_breakdown": {...}
}
```

完整格式说明请查看 `src/types/plan.ts`。

## 下一步

数据导入成功后，你可以：

1. ✅ 登录应用查看行程列表
2. ✅ 点击行程卡片查看详情
3. ✅ 在"每日行程"Tab 中查看地图展示
4. ✅ 测试导航、删除等功能
5. 🚀 开始开发 AI 生成行程功能

