




## 本地启动服务
1. pnpm install
2. pnpm dev



## 线上部署
pnpm build打包
1. 环境准备：在 ECS 上安装 Nginx (sudo yum install nginx 或 apt install nginx)。
2. 上传代码：将本地 dist 文件夹通过 SCP 或 FTP 上传到服务器目录（如 /var/www/html）。
3. 配置 Nginx：
   server {
   listen 80;
   server_name yourdomain.com;
   location / {
   root /var/www/html;
   index index.html;
   try_files $uri $uri/ /index.html; # 解决 React 路由刷新 404 问题
   }
   }
4. sudo systemctl restart nginx
