# 生产部署镜像（仅包含 Nginx + 静态文件）
# 注意：需要先在本机执行 npm run build 生成 dist 目录
FROM nginx:1.29.3-alpine

# 设置时区为上海（手动设置，不安装额外包）
ENV TZ=Asia/Shanghai

# 复制本地构建的静态文件到 nginx 目录
COPY dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

