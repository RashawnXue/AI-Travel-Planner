# 数据导入指南

本指南说明如何将示例数据导入到 Supabase 数据库中。

## 前置条件

1. 已完成 Supabase 数据库初始化（执行了 `docs/supabase-init.sql`）
2. 已注册并登录了一个用户账号

## 方法一：导入单个行程（上海动漫美食3日游）

### 步骤

1. **获取用户 ID**

   在 Supabase SQL Editor 中执行：
   ```sql
   SELECT auth.uid();
   ```
   
   复制返回的用户 ID（格式类似：`a1b2c3d4-e5f6-7890-abcd-ef1234567890`）

2. **修改 SQL 文件**

   打开 `docs/shanghai-anime-trip.sql`，将第 20 行的 `YOUR_USER_ID` 替换为实际的用户 ID：
   ```sql
   'YOUR_USER_ID', -- 请替换为实际用户 ID
   ```
   
   替换为：
   ```sql
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- 替换为你的用户 ID
   ```

3. **执行 SQL 脚本**

   在 Supabase SQL Editor 中执行整个 `docs/shanghai-anime-trip.sql` 文件

4. **验证导入**

   执行以下查询验证数据是否导入成功：
   ```sql
   SELECT id, title, destination, days FROM public.travel_plans 
   WHERE title = '上海动漫美食3日体验游';
   ```

## 方法二：导入所有示例数据

### 步骤

1. **获取用户 ID**（同方法一）

2. **修改 SQL 文件**

   打开 `docs/seed-data.sql`，使用查找替换功能：
   - 查找：`'YOUR_USER_ID'`
   - 替换为：`'a1b2c3d4-e5f6-7890-abcd-ef1234567890'`（替换为你的实际用户 ID）
   
   这将替换文件中所有的 `YOUR_USER_ID` 占位符

3. **执行 SQL 脚本**

   在 Supabase SQL Editor 中执行整个 `docs/seed-data.sql` 文件

4. **验证导入**

   执行以下查询验证数据是否导入成功：
   ```sql
   SELECT id, title, destination, days, start_date 
   FROM public.travel_plans 
   ORDER BY created_at DESC;
   ```
   
   应该能看到多个行程记录（包括东京、大理、成都、上海等）

## 数据说明

### 上海动漫美食3日游 (shanghai-anime-trip.sql)

- **目的地**：上海
- **天数**：3天
- **预算**：6000元
- **特色**：融合美食和动漫文化体验
- **亮点**：
  - 黄河路美食休闲街
  - Toei Animation东映动画官方店
  - 百联ZX创趣场二次元主题商场
  - 豫园动漫商店
  - 各类特色餐厅（海底捞、耶里夏丽、很久以前等）

### 完整示例数据 (seed-data.sql)

包含以下行程：
1. 东京深度游
2. 大理休闲游
3. 成都美食游
4. 上海动漫美食游

所有行程均包含：
- ✅ 完整的每日活动安排（含经纬度和照片）
- ✅ 住宿信息（含经纬度和照片）
- ✅ 交通方案
- ✅ 详细预算明细

## 注意事项

1. **用户 ID 必须正确**：如果用户 ID 不正确，数据将无法正确关联到你的账号
2. **数据唯一性**：重复执行同一 SQL 文件会创建重复数据，建议执行前清理旧数据
3. **字段完整性**：所有行程数据都包含了 `photo` 字段，确保前端能正确显示图片
4. **地图支持**：所有活动和住宿都包含经纬度信息，支持在地图上显示

## 清理数据

如果需要清理导入的测试数据，可以执行：

```sql
-- 删除所有行程数据（谨慎使用！）
DELETE FROM public.travel_plans WHERE user_id = 'YOUR_USER_ID';
```

或者删除特定行程：

```sql
-- 删除特定行程
DELETE FROM public.travel_plans 
WHERE user_id = 'YOUR_USER_ID' 
  AND title = '上海动漫美食3日体验游';
```

## 常见问题

### Q: 导入后看不到数据？
A: 请检查：
1. 用户 ID 是否正确替换
2. 是否使用了正确的用户账号登录前端应用
3. SQL 执行是否有错误提示

### Q: 地图不显示路线？
A: 请确保：
1. 已配置高德地图 API Key（见 `README.md` 的"高德地图配置"部分）
2. 行程数据中包含了经纬度信息（`longitude` 和 `latitude` 字段）

### Q: 照片不显示？
A: 照片 URL 来自高德地图的图片服务器，需要：
1. 确保网络连接正常
2. 检查浏览器是否阻止了跨域图片加载
3. 部分 URL 可能已过期，可以替换为其他图片 URL

## 技术支持

如遇到问题，请检查：
1. Supabase 控制台的日志
2. 浏览器开发者工具的控制台输出
3. 确保所有依赖服务（Supabase、高德地图）配置正确

