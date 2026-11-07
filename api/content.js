// Serverless Function: /api/content
// Universal Cloud Database Persistence (Vercel KV / Supabase REST)
// Supports all editable sections: services, projects, stories, milestones

const DEFAULT_SERVICES = [
      {
        id: 'srv-1',
        title: 'Rapid MVP Trial Sprint',
        isPopular: false,
        popularBadge: '',
        iconSvg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
        description: 'Transform an unverified hypothesis into a live, interactive web or mobile application with analytics, billing, and auth in under 3 weeks.',
        features: [
          'Zero to Vercel/Android deployment',
          'Payment & micro-checkout integration',
          'Quantitative user action telemetry'
        ],
        timeline: 'Typical Horizon: 14 to 21 Days'
      },
      {
        id: 'srv-2',
        title: 'Full-Stack & Custom Platforms',
        isPopular: true,
        popularBadge: 'High Demand',
        iconSvg: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
        description: 'Bespoke web applications, high-performance dashboards, and responsive frontends engineered for instant speed, modular scaling, and clean code.',
        features: [
          'Next.js, TypeScript, Tailwind, Edge APIs',
          'Postgres / Supabase / Redis architecture',
          'Sub-50ms TTFB & 99+ Lighthouse scores'
        ],
        timeline: 'Typical Horizon: Sprint-Based / Retainer'
      },
      {
        id: 'srv-3',
        title: 'Android Engineering & Tools',
        isPopular: false,
        popularBadge: '',
        iconSvg: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
        description: 'Native Android apps, developer utilities, and offline-first mobile tools with Kotlin, Jetpack Compose, and background system services.',
        features: [
          'Kotlin & Modern Jetpack Compose UI',
          'Local Room DB & background workers',
          'Play Console release pipeline readiness'
        ],
        timeline: 'Typical Horizon: 3 to 5 Weeks'
      }
    ];

const DEFAULT_PROJECTS = [
      {
        id: 'freeit',
        category: 'android',
        badge: '● Google Play Store Production',
        badgeType: 'success',
        platform: 'Android 16 (API 36) &bull; Version Code 5',
        title: 'FreeIt — Resale and Declutter App',
        attribution: 'Created by Anandovsky | Tester: Sreegovind & Gayathri',
        desc: 'A native Android WebView item resale application published to the Google Play Store, upgraded to target Android 16 (API level 36) with Version Code 5 deployed to production.',
        tech: ['Android SDK 36', 'WebView Core', 'Google Play Store', 'Version Code 5'],
        demoUrl: '#section-dashboard',
        caseUrl: '#section-dashboard'
      },
      {
        id: 'pocket-catalog',
        category: 'android',
        badge: '● Test Build Evaluated',
        badgeType: 'beta',
        platform: 'Android APK (18.7 MB) + PWA',
        title: 'Pocket Catalog — Asset Inventory',
        attribution: 'Created by Anandovsky | Tester: Sreegovind & Client Partner',
        desc: 'An Android cataloging mobile application test build downloaded and evaluated for managing structured item/asset collections.',
        tech: ['Android APK (18.7 MB)', 'Offline SQLite', 'Barcode Scanner', 'PWA Core'],
        demoUrl: '/downloads/pocket-catalog.apk',
        caseUrl: '#section-dashboard'
      },
      {
        id: 'guten-app',
        category: 'language',
        badge: '● Deployed on Vercel',
        badgeType: 'success',
        platform: 'Web & PWA',
        title: 'Guten App',
        attribution: 'Created by Anandovsky | Tester: Gayathri',
        desc: 'It is a German language learning web application.',
        tech: ['Next.js Edge', 'Web Audio API', 'German Grammar Core', 'Vercel'],
        demoUrl: 'https://vercel.com',
        caseUrl: '#contact'
      },
      {
        id: 'parlez-app',
        category: 'language',
        badge: '● Deployed on Vercel',
        badgeType: 'success',
        platform: 'Web Platform',
        title: 'Parlez App',
        attribution: 'Created by Anandovsky | Tester: Sreegovind',
        desc: 'A French learning web application.',
        tech: ['Next.js', 'Speech Synthesis', 'French Conjugation Engine', 'Vercel Edge'],
        demoUrl: 'https://vercel.com',
        caseUrl: '#contact'
      },
      {
        id: 'any-syllabus',
        category: 'web',
        badge: '● Live Web Utility',
        badgeType: 'success',
        platform: 'Curriculum Q&A Engine',
        title: 'Any Syllabus Assessment Generator',
        attribution: 'Created by Anandovsky',
        desc: 'A comprehensive Q&A generator web utility capable of turning any syllabus or instructional curriculum into structured assessment tests with automated grading rubrics.',
        tech: ['React', 'Prompt Chains', 'Schema Validation', 'Vercel Serverless'],
        hasGenerateQa: true,
        demoUrl: '#assessment-generator',
        caseUrl: '#contact'
      },
      {
        id: 'daily-tracker',
        category: 'web',
        badge: '● Active Workflow',
        badgeType: 'success',
        platform: 'Productivity System',
        title: 'Multi-Venture Daily Tracker',
        attribution: 'Created by Anandovsky',
        desc: 'A schedule-tracking and operating rhythm application structured around "Day\'s activity" time slots.',
        tech: ['Local-First DB', 'Time-Block Matrix', 'IndexedDB', 'TailwindCSS'],
        demoUrl: '#section-dashboard',
        caseUrl: '#contact'
      },
      {
        id: 'omniledger',
        category: 'web',
        badge: '● Live Platform',
        badgeType: 'success',
        platform: 'Cloud Infrastructure',
        title: 'OmniLedger Micro-Billing',
        attribution: 'Created by Anandovsky',
        desc: 'Lightweight subscription & pay-per-trial checkout module designed for solo developers to validate willingness-to-pay within 5 minutes of launch.',
        tech: ['Stripe API', 'Node.js', 'PostgreSQL', 'Webhooks'],
        demoUrl: 'https://vercel.com',
        caseUrl: '#contact'
      },
      {
        id: 'droidsprint',
        category: 'android',
        badge: '● Active Beta',
        badgeType: 'beta',
        platform: 'Android Native',
        title: 'DroidSprint Telemetry',
        attribution: 'Created by Anandovsky',
        desc: 'Lightweight developer utility for real-time memory pressure monitoring, frame-drop debugging, and battery temperature profiling on Android devices.',
        tech: ['Kotlin', 'Jetpack Compose', 'NDK / C++', 'Room DB'],
        demoUrl: '#contact',
        caseUrl: '#contact'
      },
      {
        id: 'taskmesh',
        category: 'android',
        badge: '● Open Utility',
        badgeType: 'success',
        platform: 'Android SDK 34',
        title: 'TaskMesh Offline P2P',
        attribution: 'Created by Anandovsky',
        desc: 'Zero-cloud task synchronization utility using local Wi-Fi Direct and Bluetooth mesh protocols for high-security fieldwork and developer logs.',
        tech: ['Kotlin Coroutines', 'Wi-Fi Direct', 'CRDTs', 'Crypto'],
        demoUrl: '#contact',
        caseUrl: '#contact'
      },
      {
        id: 'promptforge',
        category: 'web',
        badge: '● Experimental',
        badgeType: 'beta',
        platform: 'Developer Studio',
        title: 'PromptForge Deterministic Lab',
        attribution: 'Created by Anandovsky',
        desc: 'Regression testing and schema evaluation workbench for structured AI outputs, testing system prompt resilience across edge micro-services.',
        tech: ['React', 'Zod Schemas', 'Vercel Serverless', 'Monaco'],
        demoUrl: 'https://vercel.com',
        caseUrl: '#contact'
      }
    ];

const DEFAULT_STORIES = [
      {
        id: 'solo-trial',
        category: 'Trial Playbook',
        categoryKey: 'blueprint',
        readTime: '6 min read',
        title: 'The Solo Trial-Firm Engine: Rapid Validation Architecture',
        snippet: 'How to pressure-test web & mobile applications in under three weeks without external equity, unnecessary staff, or over-engineered infrastructure.',
        author: 'Created by Anandovsky',
        content: `
          <p>Most software ventures fail not because the code was broken, but because the founder spent six months building something nobody was willing to pull out a credit card for.</p>
          <p>A "Trial Firm" operates on inverted engineering principles: we do not build features to satisfy an arbitrary backlog. We engineer high-precision instrumented prototypes designed to extract market signals within fourteen days.</p>
          <h4>The 3-Phase Verification Lifecycle</h4>
          <p><strong>1. The Surface Probe:</strong> High-fidelity frontend, interactive UI, realistic sample workflows, and a direct value proposition.</p>
          <p><strong>2. Telemetry Over Opinions:</strong> Zero vanity metrics. We measure time-to-first-interaction, checkout intent, and return frequency.</p>
          <p><strong>3. The Hard Fork:</strong> If the signal is absent, kill the trial with zero emotional sunk-cost. If the signal is intense, scale the codebase into production.</p>
          <blockquote>"Speed of validation is the only competitive moat that cannot be bought by incumbents."</blockquote>
        `
      },
      {
        id: 'monetize-skills',
        category: 'Philosophy & Mindset',
        categoryKey: 'philosophy',
        readTime: '5 min read',
        title: 'Monetizing Deep Technical Fluency Without Consulting Debt',
        snippet: 'Trading hours for dollars in client work is an unscalable trap. Here is how to package custom development into repeatable, high-leverage software products.',
        author: 'Created by Anandovsky',
        content: `
          <p>Hourly contracting gives you cash flow, but robs you of compounding equity. The trial-firm approach bridges this dilemma by productizing software expertise into modular platforms.</p>
          <h4>Rules of Sovereign Engineering</h4>
          <p>Never sign agreements where you surrender reusable architectural components. Every module you write should accelerate the launch of your next five applications.</p>
          <p>Focus on micro-verticals: language tooling, developer telemetry, offline utilities, and specialized commerce pipelines.</p>
        `
      },
      {
        id: 'stack-philosophy',
        category: 'Architecture Stacks',
        categoryKey: 'tech',
        readTime: '8 min read',
        title: 'Zero-Bloat Engineering: Next.js Edge, Android Native & Serverless',
        snippet: 'A pragmatic technical breakdown of why minimal dependencies and edge deployments outperform complex microservices for solo engineers.',
        author: 'Created by Anandovsky',
        content: `
          <p>Kubernetes clusters and multi-region distributed databases are engineering vanity for 99% of early ventures. You do not need distributed consensus to validate product-market fit.</p>
          <h4>The Pragmatic Solo Stack</h4>
          <ul>
            <li><strong>Frontend / Edge:</strong> Next.js on Vercel with Edge middleware for sub-50ms response times globally.</li>
            <li><strong>Mobile Core:</strong> Native Kotlin with Jetpack Compose & local Room persistence for zero-latency user flows.</li>
            <li><strong>State & Auth:</strong> Supabase / Postgres with row-level security or stateless serverless JWT verification.</li>
          </ul>
          <p>Keep your stack lean, inspectable, and instantly deployable.</p>
        `
      },
      {
        id: 'solo-leverage',
        category: 'Philosophy & Mindset',
        categoryKey: 'philosophy',
        readTime: '4 min read',
        title: 'Solo Leverage in the Era of Autonomous Developer AI',
        snippet: 'How a single determined engineer with systematic toolchains can out-execute a committee of twenty engineers paralyzed by sprint retrospectives.',
        author: 'Created by Anandovsky',
        content: `
          <p>Ten years ago, launching a cross-platform software company required a frontend engineer, a backend engineer, a mobile developer, an infrastructure specialist, and an operations lead.</p>
          <p>Today, a solo engineer operating with modern agentic tools and unified deployment engines can maintain that entire surface area alone.</p>
          <blockquote>"The bottleneck is no longer how fast you type code; it is the clarity of your business hypothesis and the discipline of your architectural choices."</blockquote>
          <p>Maintain minimal external dependencies, write readable modular code, and focus on delivering direct value to the end user.</p>
        `
      }
    ];

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

// Global in-memory storage across warm serverless container executions
if (!globalThis._allContentStore) {
  globalThis._allContentStore = {
    services: [...DEFAULT_SERVICES],
    projects: [...DEFAULT_PROJECTS],
    stories: [...DEFAULT_STORIES],
    milestones: [...DEFAULT_MILESTONES]
  };
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (err) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

// Safe Merge Utility: merges incoming records into existing list by ID without wiping historical data
function safeMergeRecords(existingList = [], incomingData = [], meta = {}) {
  const existing = Array.isArray(existingList) ? [...existingList] : [];
  const incoming = Array.isArray(incomingData)
    ? incomingData
    : (incomingData && typeof incomingData === 'object' ? [incomingData] : []);

  // 1. Explicit delete action: remove specified record by ID
  if (meta && meta.action === 'delete' && meta.id != null) {
    return existing.filter(item => String(item.id) !== String(meta.id));
  }

  // 2. Build index of existing records to preserve all historical data
  const mergedMap = new Map();
  const order = [];

  for (const item of existing) {
    if (item && item.id != null) {
      const id = String(item.id);
      mergedMap.set(id, { ...item });
      order.push(id);
    }
  }

  // 3. Merge incoming records: update existing ones or append new ones
  for (const item of incoming) {
    if (!item || item.id == null) continue;
    const id = String(item.id);
    if (mergedMap.has(id)) {
      const prev = mergedMap.get(id);
      mergedMap.set(id, {
        ...prev,
        ...item,
        updatedAt: new Date().toISOString()
      });
    } else {
      mergedMap.set(id, {
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      order.unshift(id);
    }
  }

  // 4. Return stable array preserving all historical records
  const result = [];
  const seen = new Set();
  for (const id of order) {
    if (!seen.has(id) && mergedMap.has(id)) {
      seen.add(id);
      result.push(mergedMap.get(id));
    }
  }
  for (const [id, item] of mergedMap.entries()) {
    if (!seen.has(id)) {
      seen.add(id);
      result.push(item);
    }
  }

  return result;
}

export default async function handler(req, res) {
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

  const url = new URL(req.url, 'http://localhost');
  const sectionParam = url.searchParams.get('section') || url.searchParams.get('type');

  if (req.method === 'GET') {
    // 1. Try Vercel KV if configured
    if (KV_URL && KV_TOKEN) {
      try {
        const kvKey = sectionParam ? `smicky_${sectionParam}` : 'smicky_all_content';
        const kvRes = await fetch(`${KV_URL}/get/${kvKey}`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        if (kvRes.ok) {
          const kvData = await kvRes.json();
          if (kvData && kvData.result) {
            const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
            if (parsed) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                source: 'vercel-kv',
                section: sectionParam || 'all',
                data: parsed,
                updatedAt: new Date().toISOString()
              }));
              return;
            }
          }
        }
      } catch (kvErr) {
        console.warn('[Vercel KV Read Warning]', kvErr);
      }
    }

    // 2. Try Supabase if configured
    if (SUPABASE_URL && SUPABASE_KEY && sectionParam) {
      try {
        const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/${sectionParam}?select=*`, {
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
              section: sectionParam,
              data: supaData,
              updatedAt: new Date().toISOString()
            }));
            return;
          }
        }
      } catch (supaErr) {
        console.warn('[Supabase Read Warning]', supaErr);
      }
    }

    // 3. Fallback to resilient in-memory / seeded store
    const store = globalThis._allContentStore;
    let responseData = store;
    if (sectionParam && store[sectionParam]) {
      responseData = store[sectionParam];
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      source: 'memory-store',
      section: sectionParam || 'all',
      data: responseData,
      updatedAt: new Date().toISOString()
    }));
    return;
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = await readBody(req);
      const section = body.section || sectionParam;
      const data = body.data !== undefined ? body.data : (body.item || body[section]);
      const meta = body.meta || {};

      if (section) {
        // Retrieve current existing records to merge safely with
        if (!globalThis._allContentStore) globalThis._allContentStore = {};
        let existingRecords = Array.isArray(globalThis._allContentStore[section])
          ? globalThis._allContentStore[section]
          : [];

        // Check Vercel KV for latest remote state before merging
        if (KV_URL && KV_TOKEN) {
          try {
            const kvRes = await fetch(`${KV_URL}/get/smicky_${section}`, {
              headers: { Authorization: `Bearer ${KV_TOKEN}` }
            });
            if (kvRes.ok) {
              const kvData = await kvRes.json();
              if (kvData && kvData.result) {
                const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  existingRecords = parsed;
                }
              }
            }
          } catch (kvErr) {
            console.warn('[Vercel KV Pre-fetch Warning]', kvErr);
          }
        }

        // Perform safe merge: merge incoming changes into existing records, preserving historical entries
        const merged = safeMergeRecords(existingRecords, data, meta);
        globalThis._allContentStore[section] = merged;

        // Persist merged records to Vercel KV
        if (KV_URL && KV_TOKEN) {
          try {
            await fetch(`${KV_URL}/set/smicky_${section}`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(merged)
            });
            // Also update all_content snapshot
            await fetch(`${KV_URL}/set/smicky_all_content`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(globalThis._allContentStore)
            });
          } catch (kvErr) {
            console.warn('[Vercel KV Write Warning]', kvErr);
          }
        }

        // Persist to Supabase if configured
        if (SUPABASE_URL && SUPABASE_KEY) {
          try {
            await fetch(`${SUPABASE_URL}/rest/v1/${section}`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
              },
              body: JSON.stringify(merged)
            });
          } catch (supaErr) {
            console.warn('[Supabase Write Warning]', supaErr);
          }
        }

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          section: section,
          action: meta.action || 'safe_merge',
          count: merged.length,
          data: merged,
          updatedAt: new Date().toISOString(),
          meta: meta
        }));
        return;
      } else if (body.services || body.projects || body.stories || body.milestones) {
        // Bulk update across sections with safe merge
        for (const s of ['services', 'projects', 'stories', 'milestones']) {
          if (body[s]) {
            const existing = globalThis._allContentStore[s] || [];
            globalThis._allContentStore[s] = safeMergeRecords(existing, body[s], meta);
          }
        }

        if (KV_URL && KV_TOKEN) {
          try {
            await fetch(`${KV_URL}/set/smicky_all_content`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(globalThis._allContentStore)
            });
          } catch (kvErr) {
            console.warn('[Vercel KV Write Warning]', kvErr);
          }
        }

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          message: 'All content sections merged & persisted safely',
          data: globalThis._allContentStore,
          updatedAt: new Date().toISOString()
        }));
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, error: 'Invalid payload: provide section and data array' }));
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
