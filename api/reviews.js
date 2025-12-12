// Vercel Serverless Function for Google Places API
// 环境变量: GOOGLE_MAPS_API_KEY (在 Vercel 项目设置中配置)

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { placeId } = req.query;

    if (!placeId) {
      return res.status(400).json({ error: "placeId is required" });
    }

    // 尝试多个可能的环境变量名称
    const apiKey = process.env.GOOGLE_MAPS_API_KEY 
                || process.env.GOOGLE_PLACES_API_KEY
                || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      // 调试信息：列出所有包含 GOOGLE 的环境变量
      const googleEnvVars = Object.keys(process.env)
        .filter(key => key.toUpperCase().includes('GOOGLE'))
        .map(key => `${key}: ${process.env[key] ? '***' : 'undefined'}`);
      
      console.error('Missing Google Maps API Key');
      console.error('Available Google-related env vars:', googleEnvVars);
      console.error('All env var keys:', Object.keys(process.env).filter(k => k.includes('GOOGLE')));
      
      return res.status(500).json({ 
        error: "Server configuration error: Missing API key",
        status: "INTERNAL_ERROR",
        hint: "Please set GOOGLE_MAPS_API_KEY in Vercel environment variables",
        availableVars: googleEnvVars
      });
    }

    const url =
      "https://maps.googleapis.com/maps/api/place/details/json" +
      `?place_id=${encodeURIComponent(placeId)}` +
      "&fields=name,rating,reviews,url,user_ratings_total" +
      `&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

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
  