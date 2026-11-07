// Serverless Function: /api/services
// Direct section endpoint for services persistence (Vercel KV / Supabase / in-memory store)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Read via shared content handler
  const contentHandler = (await import('./content.js')).default;
  req.url = `/api/content?section=services`;
  return contentHandler(req, res);
}
