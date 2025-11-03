# 高德地图集成配置指南

## 1. 获取高德地图 API Key

### 1.1 注册高德开放平台账号
1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 点击右上角"注册/登录"
3. 完成账号注册和实名认证

### 1.2 创建应用
1. 登录后进入 [控制台](https://console.amap.com/dev/index)
2. 点击"应用管理" -> "我的应用"
3. 点击"创建新应用"
4. 填写应用名称（如：AI 旅行规划师）和应用类型

### 1.3 添加 Key
1. 在应用列表中找到刚创建的应用
2. 点击"添加 Key"
3. 填写以下信息：
   - **Key 名称**：如 "Web端"
   - **服务平台**：选择 "Web端(JS API)"
   - **域白名单**：
     - 开发环境：`localhost`
     - 生产环境：你的域名，如 `yourdomain.com`

### 1.4 获取安全密钥（可选但推荐）
1. 在应用详情页，找到"安全密钥"部分
2. 点击"设置安全密钥"
3. 记录生成的 `securityJsCode`

## 2. 配置项目

### 2.1 更新 index.html

将 `index.html` 中的占位符替换为实际的值：

```html
<script type="text/javascript">
  window._AMapSecurityConfig = {
    securityJsCode: '你的安全密钥'  // 将 your_security_code_here 替换
  }
</script>
<script src="https://webapi.amap.com/maps?v=2.0&key=你的API_Key"></script>
<!-- 将 your_amap_key_here 替换 -->
```

### 2.2 配置环境变量（可选）

如果你想通过环境变量管理，可以：

1. 在 `.env` 文件中添加：
```env
VITE_AMAP_KEY=你的API_Key
VITE_AMAP_SECURITY_CODE=你的安全密钥
```

2. 修改 `index.html`，使用环境变量：
```html
<script type="text/javascript">
  window._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE
  }
</script>
<script src="https://webapi.amap.com/maps?v=2.0&key=import.meta.env.VITE_AMAP_KEY"></script>
```

注意：由于 `index.html` 不支持直接使用环境变量，推荐使用硬编码或在 `main.ts` 中动态加载。

## 3. 功能说明

### 3.1 地图显示
- 自动显示当天所有有经纬度的行程景点
- 用不同颜色标记起点、景点和终点（住宿）
- 自动绘制景点间的路线

### 3.2 交互功能
- **点击标记**：显示景点详细信息（名称、时间、费用等）
- **切换天数**：自动更新地图显示对应天的路线
- **自动缩放**：自适应显示所有景点，确保完整可见

### 3.3 标记说明
- 🟢 **绿色圆点**：当天第一个景点（起点）
- 🔵 **紫色数字**：中间景点（按顺序编号）
- 🔴 **红色酒店图标**：最后一个点（住宿）

## 4. 测试

### 4.1 本地测试
```bash
npm run dev
```

### 4.2 访问行程详情页
1. 登录系统
2. 进入任意行程详情
3. 查看"每日行程" Tab
4. 确认地图正常显示并能看到标记和路线

### 4.3 检查控制台
如果地图无法显示，打开浏览器开发者工具（F12），查看控制台是否有错误信息。

## 5. 常见问题

### Q1: 地图显示空白
**原因**：API Key 未配置或配置错误

**解决方案**：
1. 检查 `index.html` 中的 Key 是否正确
2. 确认域白名单包含当前访问域名
3. 检查浏览器控制台是否有 API 错误

### Q2: 提示 "INVALID_USER_KEY"
**原因**：API Key 无效或过期

**解决方案**：
1. 重新检查 Key 是否复制正确
2. 确认应用状态是否正常
3. 检查 Key 的服务平台是否选择了 "Web端(JS API)"

### Q3: 地图显示但没有标记
**原因**：行程数据缺少经纬度信息

**解决方案**：
1. 确保行程数据包含 `longitude` 和 `latitude` 字段
2. 可以使用 `docs/seed-data.sql` 中的示例数据测试
3. 查看控制台是否有 "当前行程暂无地理位置信息" 的提示

### Q4: 跨域错误
**原因**：域名未加入白名单

**解决方案**：
1. 进入高德控制台
2. 在 Key 配置中添加当前访问域名到白名单
3. 本地开发使用 `localhost` 或 `127.0.0.1`

## 6. 高德地图 API 配额

### 免费配额
- **个人开发者**：每日 30 万次
- **企业开发者**：每日 100 万次

### 超额处理
如果超出配额，地图将无法加载。建议：
1. 监控 API 调用量
2. 实现地图缓存策略
3. 考虑升级为付费版本

## 7. 相关文档

- [高德地图 JS API 文档](https://lbs.amap.com/api/javascript-api/summary)
- [Key 申请和配置](https://lbs.amap.com/api/javascript-api/guide/abc/prepare)
- [安全密钥说明](https://lbs.amap.com/faq/js-api/map-js-api/43112)

## 8. 支持

如遇到问题，可以：
1. 查看[高德开放平台 FAQ](https://lbs.amap.com/faq)
2. 访问[开发者社区](https://lbs.amap.com/dev/index)
3. 联系技术支持

