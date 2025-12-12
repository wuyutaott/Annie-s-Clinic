# Google Places API 设置指南

## 如何获取 Google Places API Key

### 步骤 1: 访问 Google Cloud Console
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 使用你的 Google 账号登录（如果没有账号，需要先注册）

### 步骤 2: 创建新项目
1. 在页面顶部，点击项目选择器（显示当前项目名称的下拉菜单）
2. 点击 **"新建项目"** (New Project)
3. 输入项目名称，例如："Acupuncture Clinic Website"
4. 点击 **"创建"** (Create)

### 步骤 3: 启用 Places API
1. 在左侧菜单中，点击 **"API 和服务"** (APIs & Services) > **"库"** (Library)
2. 在搜索框中输入 **"Places API"**
3. 点击 **"Places API"** 结果
4. 点击 **"启用"** (Enable) 按钮

### 步骤 4: 创建 API 密钥
1. 在左侧菜单中，点击 **"API 和服务"** (APIs & Services) > **"凭据"** (Credentials)
2. 点击页面顶部的 **"+ 创建凭据"** (+ Create Credentials) 按钮
3. 选择 **"API 密钥"** (API Key)
4. 系统会生成一个新的 API 密钥，复制并保存它

### 步骤 5: 配置 API 密钥限制（重要！）
为了安全，建议设置 API 密钥限制：

1. 在 **"凭据"** 页面，点击你刚创建的 API 密钥
2. 在 **"API 限制"** (API restrictions) 部分：
   - 选择 **"限制密钥"** (Restrict key)
   - 在 **"选择 API"** 下拉菜单中，选择 **"Places API"**
3. 在 **"应用程序限制"** (Application restrictions) 部分：
   - 选择 **"HTTP 引荐来源网址（网站）"** (HTTP referrers)
   - 添加你的网站域名，例如：
     - `https://your-domain.com/*`
     - `https://*.vercel.app/*` (如果使用 Vercel)
     - `http://localhost:*` (用于本地开发)
4. 点击 **"保存"** (Save)

### 步骤 6: 获取 Place ID
1. 在浏览器中打开 [Google Maps](https://www.google.com/maps)
2. 搜索你的诊所地址：`1310 W Stewart Dr Ste 302, Orange, CA 92868`
3. 找到你的诊所地点，点击它
4. 在地址栏的 URL 中，你会看到类似这样的内容：
   ```
   https://www.google.com/maps/place/.../@33.xxx,-117.xxx/data=!3m1!4b1!4m6!3m5!1s0x80dce...!8m2!3d33.xxx!4d-117.xxx!16s%2Fg%2F11xxxxx
   ```
5. 或者，在 Google Maps 中右键点击你的地点，选择 **"这是什么？"** (What's here?)，在信息卡片中可以看到 Place ID
6. 更简单的方法：使用 [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) 工具

### 步骤 7: 更新代码
在 `index.html` 文件中，找到以下代码：

```javascript
const API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';
const PLACE_ID = 'YOUR_GOOGLE_PLACE_ID';
```

替换为：

```javascript
const API_KEY = '你的实际API密钥';
const PLACE_ID = '你的实际Place ID';
```

## 费用说明

- Google Places API 有免费额度：每月 $200 的免费信用额度
- 通常可以免费获取约 40,000 次 API 调用
- 超出免费额度后，按使用量收费
- 对于小型网站，通常不会超出免费额度

## 注意事项

1. **不要将 API 密钥提交到公开的代码仓库**
   - 如果使用 Git，确保将包含 API 密钥的文件添加到 `.gitignore`
   - 或者使用环境变量

2. **设置 API 密钥限制很重要**
   - 防止他人滥用你的 API 密钥
   - 限制只能从你的网站域名调用

3. **监控 API 使用情况**
   - 在 Google Cloud Console 中设置预算提醒
   - 定期检查 API 使用量

## 替代方案

如果不想使用 Google Places API，你可以：
1. 手动添加评价数据到代码中
2. 使用其他第三方评价服务
3. 定期手动更新评价数据

## 需要帮助？

如果遇到问题，可以：
- 查看 [Google Places API 官方文档](https://developers.google.com/maps/documentation/places/web-service)
- 检查浏览器控制台的错误信息
- 确认 API 密钥和 Place ID 是否正确

