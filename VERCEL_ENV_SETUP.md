# Vercel 环境变量配置指南

## 如何配置环境变量

### 步骤 1: 登录 Vercel Dashboard
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 登录你的账号

### 步骤 2: 选择项目
1. 在项目列表中找到你的项目
2. 点击项目名称进入项目设置

### 步骤 3: 添加环境变量
1. 点击顶部菜单的 **"Settings"** (设置)
2. 在左侧菜单中点击 **"Environment Variables"** (环境变量)
3. 点击 **"Add New"** (添加新变量) 按钮

### 步骤 4: 配置环境变量
1. **Key (键名)**: 输入 `GOOGLE_MAPS_API_KEY`
   - ⚠️ 注意：必须完全匹配，区分大小写
   - 不要有空格或特殊字符

2. **Value (值)**: 粘贴你的 Google Places API Key
   - 例如: `AIzaSyBVvo_S4vWZQI6lG7OKoPI63-RcEFvYMqY`

3. **Environment (环境)**: 选择需要应用的环境
   - ✅ **Production** (生产环境) - 必须选择
   - ✅ **Preview** (预览环境) - 建议选择
   - ✅ **Development** (开发环境) - 可选

4. 点击 **"Save"** (保存)

### 步骤 5: 重新部署
⚠️ **重要**: 添加或修改环境变量后，必须重新部署项目才能生效！

1. 在项目页面，点击 **"Deployments"** (部署)
2. 点击最新部署右侧的 **"..."** 菜单
3. 选择 **"Redeploy"** (重新部署)
4. 或者推送新的代码更改来触发自动部署

## 验证环境变量

### 方法 1: 检查 Vercel Dashboard
1. 进入项目 Settings > Environment Variables
2. 确认 `GOOGLE_MAPS_API_KEY` 已列出
3. 确认值已正确设置（显示为 `••••••••`）

### 方法 2: 使用 Vercel CLI
```bash
# 安装 Vercel CLI (如果还没有)
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 查看环境变量
vercel env ls
```

### 方法 3: 在代码中临时调试
可以在 `api/reviews.js` 中添加临时调试代码（仅用于测试，不要提交到生产环境）：

```javascript
console.log('Environment variables check:');
console.log('GOOGLE_MAPS_API_KEY exists:', !!process.env.GOOGLE_MAPS_API_KEY);
console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('GOOGLE')));
```

## 常见问题

### 问题 1: 环境变量名称不匹配
- ✅ 正确: `GOOGLE_MAPS_API_KEY`
- ❌ 错误: `GOOGLE_MAP_API_KEY` (少了一个 S)
- ❌ 错误: `google_maps_api_key` (小写)
- ❌ 错误: `GOOGLE_MAPS_API_KEY ` (末尾有空格)

### 问题 2: 环境变量未应用到正确的环境
- 确保选择了 **Production** 环境
- 如果使用 Preview 分支，也要选择 **Preview**

### 问题 3: 部署后仍未生效
- 环境变量修改后必须重新部署
- 清除浏览器缓存
- 等待几分钟让 Vercel 完成部署

### 问题 4: 本地开发环境
如果要在本地测试，需要创建 `.env.local` 文件：

```bash
# .env.local (不要提交到 Git)
GOOGLE_MAPS_API_KEY=你的API密钥
```

## 安全建议

1. **不要**将 API Key 提交到 Git 仓库
2. **不要**在前端代码中硬编码 API Key
3. 使用环境变量是正确的方法 ✅
4. 在 Vercel 中设置 API Key 限制（在 Google Cloud Console 中）

## 需要帮助？

如果仍然遇到问题：
1. 检查 Vercel 部署日志中的错误信息
2. 确认环境变量名称完全匹配
3. 确认已重新部署项目
4. 检查 Google Cloud Console 中的 API Key 是否有效

