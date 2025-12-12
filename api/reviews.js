// Vercel Serverless Function for Google Places API
// 环境变量: GOOGLE_MAPS_API_KEY (在 Vercel 项目设置中配置)

export default async function handler(req, res) {
  // ========== 调试信息：请求开始 ==========
  console.log('=== Reviews API Handler Called ===');
  console.log('Method:', req.method);
  console.log('Query:', req.query);
  console.log('URL:', req.url);
  
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request, returning 200');
    return res.status(200).end();
  }

  // 只允许 GET 请求
  if (req.method !== 'GET') {
    console.error('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { placeId } = req.query;
    console.log('Place ID from query:', placeId);

    if (!placeId) {
      console.error('Missing placeId in query');
      return res.status(400).json({ error: "placeId is required" });
    }

    // ========== 调试信息：环境变量检查 ==========
    console.log('=== Checking Environment Variables ===');
    
    // 检查所有可能的环境变量名称
    const envVarNames = [
      'GOOGLE_MAPS_API_KEY',
      'GOOGLE_PLACES_API_KEY',
      'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
      'VITE_GOOGLE_MAPS_API_KEY'
    ];
    
    const envVarStatus = {};
    envVarNames.forEach(name => {
      const value = process.env[name];
      envVarStatus[name] = {
        exists: !!value,
        length: value ? value.length : 0,
        preview: value ? `${value.substring(0, 8)}...` : 'undefined'
      };
      console.log(`  ${name}: ${value ? `✓ Found (length: ${value.length}, preview: ${value.substring(0, 8)}...)` : '✗ Not found'}`);
    });
    
    // 列出所有包含 GOOGLE 的环境变量
    const allGoogleVars = Object.keys(process.env)
      .filter(key => key.toUpperCase().includes('GOOGLE'))
      .map(key => ({
        name: key,
        exists: !!process.env[key],
        length: process.env[key] ? process.env[key].length : 0
      }));
    
    console.log('All Google-related env vars:', allGoogleVars);
    console.log('Total env vars count:', Object.keys(process.env).length);
    
    // 尝试多个可能的环境变量名称
    const apiKey = process.env.GOOGLE_MAPS_API_KEY 
                || process.env.GOOGLE_PLACES_API_KEY
                || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                || process.env.VITE_GOOGLE_MAPS_API_KEY;
    
    // ========== 调试信息：API Key 检查结果 ==========
    if (apiKey) {
      console.log('=== API Key Found ===');
      console.log('  Source: GOOGLE_MAPS_API_KEY=' + (!!process.env.GOOGLE_MAPS_API_KEY) 
                + ', GOOGLE_PLACES_API_KEY=' + (!!process.env.GOOGLE_PLACES_API_KEY)
                + ', NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=' + (!!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
                + ', VITE_GOOGLE_MAPS_API_KEY=' + (!!process.env.VITE_GOOGLE_MAPS_API_KEY));
      console.log('  Length:', apiKey.length);
      console.log('  Preview:', apiKey.substring(0, 12) + '...');
    } else {
      console.error('=== API Key NOT Found ===');
      console.error('  Checked variables:', envVarNames);
      console.error('  Environment variable status:', envVarStatus);
      console.error('  All Google-related vars:', allGoogleVars);
      
      return res.status(500).json({ 
        error: "Server configuration error: Missing API key",
        status: "INTERNAL_ERROR",
        hint: "Please set GOOGLE_MAPS_API_KEY in Vercel environment variables",
        debug: {
          checkedVariables: envVarNames,
          envVarStatus: envVarStatus,
          allGoogleVars: allGoogleVars,
          totalEnvVars: Object.keys(process.env).length
        }
      });
    }

    // ========== 调试信息：准备调用 Google API ==========
    const url =
      "https://maps.googleapis.com/maps/api/place/details/json" +
      `?place_id=${encodeURIComponent(placeId)}` +
      "&fields=name,rating,reviews,url,user_ratings_total" +
      `&key=${encodeURIComponent(apiKey)}`;
    
    console.log('=== Calling Google Places API ===');
    console.log('  URL (without key):', url.replace(/key=[^&]+/, 'key=***'));
    console.log('  Place ID:', placeId);

    const response = await fetch(url);
    
    console.log('=== Google API Response ===');
    console.log('  Status:', response.status);
    console.log('  Status Text:', response.statusText);
    console.log('  OK:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('  Error response body:', errorText);
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('=== Google API Data ===');
    console.log('  Status:', data.status);
    console.log('  Has result:', !!data.result);
    if (data.result) {
      console.log('  Place name:', data.result.name);
      console.log('  Rating:', data.result.rating);
      console.log('  Reviews count:', data.result.reviews ? data.result.reviews.length : 0);
    }

    // 返回 Google Places API 的原始响应
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error in reviews API:', err);
    return res.status(500).json({ 
      error: err.message || 'Internal server error',
      status: "ERROR"
    });
  }
}
  