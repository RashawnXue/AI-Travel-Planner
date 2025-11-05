# 语音识别配置说明

## 纯前端实现方案

本项目使用纯前端方式实现语音识别：

1. 用户录音保存为 Blob（内存中的临时文件）
2. 上传到阿里云 OSS 获取公网 URL
3. 调用阿里云 Paraformer API 进行识别
4. 识别完成后删除 OSS 临时文件

## 安装依赖

```bash
npm install ali-oss
```

## 环境变量配置

在 `.env` 文件中添加以下配置：

```env
# 阿里云 DashScope API Key（用于 ASR 识别）
VITE_PF_API_KEY=your_dashscope_api_key

# 阿里云 OSS 配置（用于临时存储录音文件）
VITE_OSS_REGION=oss-cn-beijing
VITE_OSS_ACCESS_KEY_ID=your_oss_access_key_id
VITE_OSS_ACCESS_KEY_SECRET=your_oss_access_key_secret
VITE_OSS_BUCKET=your_bucket_name
```

## OSS Bucket 配置要求

1. **创建 Bucket**：在阿里云 OSS 控制台创建一个 Bucket
2. **设置公共读权限**：Bucket ACL 设置为"公共读"，允许通过 URL 访问文件
3. **CORS 配置**：允许跨域访问

CORS 配置示例：
```xml
<CORSRule>
  <AllowedOrigin>*</AllowedOrigin>
  <AllowedMethod>GET</AllowedMethod>
  <AllowedMethod>POST</AllowedMethod>
  <AllowedMethod>PUT</AllowedMethod>
  <AllowedMethod>DELETE</AllowedMethod>
  <AllowedHeader>*</AllowedHeader>
</CORSRule>
```

## 工作流程

1. 用户点击开始录音 → 麦克风开始采集
2. 用户点击停止录音 → 生成 WebM 格式音频 Blob
3. 自动上传到 OSS → 获得公网可访问的 URL
4. 提交 ASR 任务 → 使用 OSS URL
5. 轮询查询结果 → 最多等待 60 秒
6. 获取识别文本 → 删除 OSS 临时文件

## 注意事项

- OSS 存储会产生少量费用（临时文件很快删除）
- 确保 OSS Bucket 设置了自动清理规则（防止临时文件堆积）
- 建议为录音文件设置单独的文件夹（如 `recordings/`）方便管理
