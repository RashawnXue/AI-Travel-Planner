# 修复 "invalid input syntax for type date" 错误

## 问题描述

**错误信息：**
```json
{
    "code": "22007",
    "details": null,
    "hint": null,
    "message": "invalid input syntax for type date: \"\""
}
```

**问题原因：**
1. PostgreSQL 的 `date` 类型不接受空字符串 `""`
2. 表结构中 `start_date` 字段设置为 `NOT NULL`，但 AI 可能返回空字符串或未返回该字段
3. 插入数据时将空字符串传给了 `date` 字段

## 解决方案

### 1️⃣ 修改数据库表结构（必须执行）

在 **Supabase SQL Editor** 中执行以下 SQL：

```sql
-- 允许 start_date 为 NULL
ALTER TABLE public.travel_plans 
  ALTER COLUMN start_date DROP NOT NULL;

-- 允许其他可能为空的字段
ALTER TABLE public.travel_plans 
  ALTER COLUMN destination DROP NOT NULL;

ALTER TABLE public.travel_plans 
  ALTER COLUMN summary DROP NOT NULL;

-- 设置默认值
ALTER TABLE public.travel_plans 
  ALTER COLUMN preferences SET DEFAULT '{}';

ALTER TABLE public.travel_plans 
  ALTER COLUMN days SET DEFAULT 1;

ALTER TABLE public.travel_plans 
  ALTER COLUMN budget SET DEFAULT 0;

ALTER TABLE public.travel_plans 
  ALTER COLUMN travelers SET DEFAULT 1;
```

**或者直接执行：**
- 文件：`docs/fix-start-date-nullable.sql`
- 在 Supabase Dashboard → SQL Editor 中粘贴并运行

### 2️⃣ 前端数据清理（已完成）

在 `src/api/plan.ts` 的 `createPlanFromAI` 函数中：

```typescript
const payload = {
  user_id: userId,
  title: ai.title?.trim() || '未命名行程',
  destination: ai.destination?.trim() || '',
  days: ai.days || 1,
  budget: ai.budget || 0,
  travelers: ai.travelers || 1,
  preferences: Array.isArray(ai.preferences) ? ai.preferences : [],
  // ✅ 关键修复：空字符串转为 null
  start_date: ai.start_date && ai.start_date.trim() !== '' 
    ? ai.start_date.trim() 
    : null,
  summary: ai.summary?.trim() || '',
  ai_response: ai
}
```

**修复说明：**
- ✅ 所有字符串字段都调用 `.trim()` 去除空格
- ✅ 所有字段都提供默认值，避免 `undefined`
- ✅ `start_date` 空字符串转为 `null`（PostgreSQL 接受 null 但不接受空字符串）
- ✅ `preferences` 确保是数组类型

## 执行步骤

### Step 1: 修改数据库

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目 `AI-Travel-Planner`
3. 进入 **SQL Editor**
4. 复制 `docs/fix-start-date-nullable.sql` 的内容
5. 点击 **Run** 执行

**验证结果：**
```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'travel_plans' 
  AND column_name = 'start_date';
```

应该返回：
```
column_name | data_type | is_nullable | column_default
start_date  | date      | YES         | NULL
```

### Step 2: 测试验证

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 登录应用

3. 创建新行程，尝试以下场景：
   - ✅ **不填写出发日期**（表单中的补充信息留空）
   - ✅ **只输入文字描述**，不选择日期
   - ✅ **AI 返回的数据中没有 start_date**

4. 观察 Console 日志：
   ```
   Inserting travel plan with payload: {
     ...
     start_date: null,  // ✅ 应该是 null 而不是空字符串
     ...
   }
   ```

5. 验证是否成功保存并跳转到详情页

## 其他可能的日期错误

### 错误 1: 日期格式不正确

**错误信息：**
```
invalid input syntax for type date: "2024/11/04"
```

**原因：** PostgreSQL `date` 类型要求格式为 `YYYY-MM-DD`

**解决：** 在前端格式化日期
```typescript
// ❌ 错误
start_date: "2024/11/04"

// ✅ 正确
start_date: "2024-11-04"
```

### 错误 2: 传入了时间戳

**错误信息：**
```
invalid input syntax for type date: "1699056000000"
```

**解决：** 将时间戳转为日期字符串
```typescript
// 如果是时间戳
const date = new Date(timestamp)
start_date: date.toISOString().split('T')[0]  // "2024-11-04"
```

### 错误 3: 传入了完整的 ISO 日期时间

**错误信息：**
```
invalid input syntax for type date: "2024-11-04T10:30:00Z"
```

**解决：** 只取日期部分
```typescript
start_date: isoDateString.split('T')[0]  // "2024-11-04"
```

## 防御性编程建议

在所有处理日期的地方都进行验证：

```typescript
/**
 * 安全地转换日期为 PostgreSQL date 格式
 * @param dateInput 日期输入（字符串、Date 对象或 null/undefined）
 * @returns YYYY-MM-DD 格式的字符串或 null
 */
function sanitizeDateForDB(dateInput: string | Date | null | undefined): string | null {
  if (!dateInput) return null
  
  try {
    let date: Date
    
    if (dateInput instanceof Date) {
      date = dateInput
    } else if (typeof dateInput === 'string') {
      const trimmed = dateInput.trim()
      if (trimmed === '') return null
      date = new Date(trimmed)
    } else {
      return null
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) return null
    
    // 返回 YYYY-MM-DD 格式
    return date.toISOString().split('T')[0]
  } catch {
    return null
  }
}

// 使用示例
start_date: sanitizeDateForDB(ai.start_date)
```

## 回滚方案

如果需要恢复 `NOT NULL` 约束（不建议）：

```sql
-- 先更新所有 NULL 值为默认日期
UPDATE public.travel_plans 
SET start_date = CURRENT_DATE 
WHERE start_date IS NULL;

-- 再添加 NOT NULL 约束
ALTER TABLE public.travel_plans 
  ALTER COLUMN start_date SET NOT NULL;
```

## 总结

✅ **已修复：**
1. 数据库表结构允许 `start_date` 为 NULL
2. 前端代码将空字符串转为 null
3. 所有字段都有合理的默认值

✅ **测试场景：**
- 不填写日期创建行程 → 成功
- AI 未返回日期 → 成功
- AI 返回空字符串 → 自动转为 null → 成功

⚠️ **注意事项：**
- 必须先执行数据库 SQL 修改
- 已有的错误数据需要手动清理
- 建议在 Supabase Dashboard 查看表结构确认修改成功
