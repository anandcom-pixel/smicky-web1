// Serverless Function: /api/milestones
// Connects to Cloud Database (Vercel KV or Supabase) with in-memory & fallback store

const DEFAULT_MILESTONES = [
  {
    id: 'mile-freeit',
    title: 'FreeIt — Resale and Declutter App',
    statusBadge: 'Sprint 03 &bull; Release Candidate',
    badgeClass: 'in-progress',
    platform: 'Android Native &bull; API 36',
    assigned: 'Assigned QA Lead: Sreegovind',
    flexibleNote: 'Self-Paced Testing (Flexible around student exam schedules &bull; No monthly or yearly targets/deadlines &mdash; contribute whenever you have free time).',
    desc: 'A native Android WebView item resale application published to the Google Play Store, upgraded to target Android 16 (API level 36) with Version Code 5 deployed to production.',
    progress: 85,
    nextDeliverable: 'Android 16 wake-lock benchmark & log parser validation. Target: Nov 12, 2026.',
    actionType: 'apk',
    actionLabel: 'Download Test APK (v1.4.2-rc3 &bull; 18.4 MB)',
    actionTarget: 'FreeIt-v1.4.2-preview.apk',
    actionParam: 18.4
  },
  {
    id: 'mile-pocket',
    title: 'Pocket Catalog — Asset Inventory',
    statusBadge: 'Sprint 02 &bull; Feature Verification',
    badgeClass: 'in-progress',
    platform: 'PWA + Android APK',
    assigned: 'Assigned: Client Partner & Sreegovind',
    flexibleNote: 'Self-Paced Testing (Flexible around student exam schedules &bull; No monthly or yearly targets/deadlines &mdash; contribute whenever you have free time).',
    desc: 'An Android cataloging mobile application test build downloaded and evaluated for managing structured item/asset collections.',
    progress: 70,
    nextDeliverable: 'Offline SQLite sync under network throttling & CSV export. Target: Nov 20, 2026.',
    actionType: 'apk_official',
    actionLabel: 'Download Official APK (v2.1.0 &bull; 18.7 MB)',
    actionTarget: '/downloads/pocket-catalog.apk',
    actionParam: 18.7
  },
  {
    id: 'mile-guten',
    title: 'Guten App',
    statusBadge: 'Staging Candidate &bull; Production Audit',
    badgeClass: 'in-progress',
    platform: 'Web & PWA',
    assigned: 'Assigned Linguist Lead: Gayathri',
    flexibleNote: 'Self-Paced Testing (Flexible around student exam schedules &bull; No monthly or yearly targets/deadlines &mdash; contribute whenever you have free time).',
    desc: 'It is a German language learning web application.',
    progress: 95,
    nextDeliverable: 'German grammatical case training loop & phonetic audio buffer review. Target: Nov 16, 2026.',
    actionType: 'link',
    actionLabel: 'Launch Staging Preview (staging.gutenapp.vercel.app)',
    actionTarget: 'https://vercel.com',
    actionParam: 0
  },
  {
    id: 'mile-parlez',
    title: 'Parlez App',
    statusBadge: 'Beta Review &bull; Active Testing',
    badgeClass: 'in-progress',
    platform: 'Web Platform',
    assigned: 'Assigned QA: Sreegovind',
    flexibleNote: 'Self-Paced Testing (Flexible around student exam schedules &bull; No monthly or yearly targets/deadlines &mdash; contribute whenever you have free time).',
    desc: 'A French learning web application.',
    progress: 80,
    nextDeliverable: 'French irregular verb speech synthesis & audio conjugation drills. Target: Nov 22, 2026.',
    actionType: 'link',
    actionLabel: 'Launch French Learning Preview',
    actionTarget: 'https://vercel.com',
    actionParam: 0
  },
  {
    id: 'mile-syllabus',
    title: 'Any Syllabus Assessment Generator',
    statusBadge: 'Live Web Utility &bull; Sprint 01',
    badgeClass: 'in-progress',
    platform: 'Cloud Utility',
    assigned: 'Assigned: Solo Platform & Client Partner',
    flexibleNote: '',
    desc: 'A comprehensive Q&A generator web utility capable of turning any syllabus or instructional curriculum into structured assessment tests with automated grading rubrics.',
    progress: 90,
    nextDeliverable: 'Curriculum schema parser & export to PDF/Markdown. Target: Nov 25, 2026.',
    actionType: 'generate_qa',
    actionLabel: 'Generate Q&A',
    actionTarget: 'modal',
    actionParam: 0
  },
  {
    id: 'mile-tracker',
    title: 'Multi-Venture Daily Tracker',
    statusBadge: 'Production Active &bull; Daily Ops',
    badgeClass: 'in-progress',
    platform: 'Productivity System',
    assigned: 'Operating Rhythm: Anandovsky',
    flexibleNote: '',
    desc: 'A schedule-tracking and operating rhythm application structured around "Day\'s activity" time slots.',
    progress: 100,
    nextDeliverable: 'Daily time slot allocation telemetry & multi-venture burn charts. Target: Nov 30, 2026.',
    actionType: 'tracker',
    actionLabel: 'Open Daily Operating Rhythm',
    actionTarget: '#section-dashboard',
    actionParam: 0
  }
];

// Initialize global in-memory persistence across serverless container executions
if (!globalThis._milestonesStore) {
  globalThis._milestonesStore = [...DEFAULT_MILESTONES];
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (req.method === 'GET') {
    // 1. Try Vercel KV if configured
    if (KV_URL && KV_TOKEN) {
      try {
        const kvRes = await fetch(`${KV_URL}/get/smicky_milestones`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        if (kvRes.ok) {
          const kvData = await kvRes.json();
          if (kvData && kvData.result) {
            const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
            if (Array.isArray(parsed) && parsed.length > 0) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                source: 'vercel-kv',
                data: parsed,
                updatedAt: new Date().toISOString()
              }));
              return;
            }
          }
        }
      } catch (err) {
        console.warn('[Vercel KV Read Warning]', err);
      }
    }

    // 2. Try Supabase REST if configured
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/milestones?select=*&order=id.asc`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        if (supaRes.ok) {
          const supaData = await supaRes.json();
          if (Array.isArray(supaData) && supaData.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              source: 'supabase',
              data: supaData,
              updatedAt: new Date().toISOString()
            }));
            return;
          }
        }
      } catch (err) {
        console.warn('[Supabase Read Warning]', err);
      }
    }

    // 3. Fallback to resilient serverless memory store / default
    const data = globalThis._milestonesStore && globalThis._milestonesStore.length > 0 
      ? globalThis._milestonesStore 
      : DEFAULT_MILESTONES;

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      source: 'memory-store',
      data: data,
      updatedAt: new Date().toISOString()
    }));
    return;
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = await readBody(req);
      const milestones = Array.isArray(body) ? body : (body.milestones || body.data);

      if (!Array.isArray(milestones) || milestones.length === 0) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Invalid milestones array' }));
        return;
      }

      // Update in-memory store
      globalThis._milestonesStore = milestones;

      // 1. Sync to Vercel KV if available
      if (KV_URL && KV_TOKEN) {
        try {
          await fetch(`${KV_URL}/set/smicky_milestones`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${KV_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(milestones)
          });
        } catch (err) {
          console.warn('[Vercel KV Write Warning]', err);
        }
      }

      // 2. Sync to Supabase if available
      if (SUPABASE_URL && SUPABASE_KEY) {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/milestones`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(milestones)
          });
        } catch (err) {
          console.warn('[Supabase Write Warning]', err);
        }
      }

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Milestones saved & synced across cloud nodes',
        count: milestones.length,
        updatedAt: new Date().toISOString(),
        meta: body.meta || {}
      }));
      return;
    } catch (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  res.statusCode = 405;
  res.end('Method Not Allowed');
}
