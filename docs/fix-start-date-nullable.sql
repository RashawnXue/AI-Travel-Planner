-- 修复 travel_plans 表字段约束
-- 允许某些字段为 NULL，因为 AI 生成的数据可能不完整或用户未填写

-- 1. 将 start_date 改为可为 NULL（用户可能不指定出发日期）
ALTER TABLE public.travel_plans 
  ALTER COLUMN start_date DROP NOT NULL;

-- 2. 将 destination 改为可为 NULL 或设置默认值（AI 可能未返回）
ALTER TABLE public.travel_plans 
  ALTER COLUMN destination DROP NOT NULL;

-- 3. 将 summary 改为可为 NULL（AI 可能未返回摘要）
ALTER TABLE public.travel_plans 
  ALTER COLUMN summary DROP NOT NULL;

-- 4. 为 preferences 设置默认值为空数组（避免 NULL 问题）
ALTER TABLE public.travel_plans 
  ALTER COLUMN preferences SET DEFAULT '{}';

-- 5. 为 days 设置默认值为 1（避免 NULL 问题）
ALTER TABLE public.travel_plans 
  ALTER COLUMN days SET DEFAULT 1;

-- 6. 为 budget 设置默认值为 0（避免 NULL 问题）
ALTER TABLE public.travel_plans 
  ALTER COLUMN budget SET DEFAULT 0;

-- 7. 为 travelers 设置默认值为 1（避免 NULL 问题）
ALTER TABLE public.travel_plans 
  ALTER COLUMN travelers SET DEFAULT 1;

-- 验证修改结果
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'travel_plans' 
  AND column_name IN ('start_date', 'destination', 'summary', 'preferences', 'days', 'budget', 'travelers')
ORDER BY ordinal_position;
