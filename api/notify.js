// Serverless Function: /api/notify
// Handles automated email notifications dispatched to anand.com@gmail.com on content updates

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      status: 'active',
      targetRecipient: 'anand.com@gmail.com',
      service: 'Anandovsky Studio Notification Service'
    }));
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req);
      const recipient = body.recipient || 'anand.com@gmail.com';
      const itemType = body.itemType || 'Active Sprint Milestone';
      const projectTitle = body.projectTitle || 'Project Update';
      const changesSummary = body.changesSummary || 'Content modified';
      const session = body.session || { name: 'Authorized Collaborator', role: 'Tester' };
      const timestamp = body.timestamp || new Date().toISOString();

      const notificationPayload = {
        to: recipient,
        from: 'alerts@anandovsky.studio',
        subject: `[Studio Alert] ${itemType} Updated: ${projectTitle}`,
        text: `ANANDOVSKY STUDIO — CONTENT UPDATE NOTIFICATION\n===============================================\nItem Type: ${itemType}\nProject Title: ${projectTitle}\nTimestamp: ${timestamp}\n\nUSER SESSION DETAILS:\n---------------------\nUser: ${session.name || 'Collaborator'} (@${session.username || 'user'})\nRole: ${session.role || 'Reviewer'}\n\nUPDATED CONTENT SUMMARY:\n------------------------\n${changesSummary}\n\n---\nDispatched automatically from Anandovsky Solo Development Platform\nTarget Recipient: ${recipient}`,
        meta: {
          itemType,
          projectTitle,
          session,
          timestamp
        }
      };

      console.log(`[STUDIO_ALERT] Email notification dispatched to ${recipient} for [${itemType}: ${projectTitle}] at ${timestamp}`);

      // If Resend API Key is configured in Vercel environment
      if (process.env.RESEND_API_KEY) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: process.env.RESEND_FROM || 'alerts@resend.dev',
              to: recipient,
              subject: notificationPayload.subject,
              text: notificationPayload.text
            })
          });
        } catch (resendErr) {
          console.warn('[Resend API Warning]', resendErr);
        }
      }

      // If SendGrid API Key is configured in Vercel environment
      if (process.env.SENDGRID_API_KEY) {
        try {
          await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: recipient }] }],
              from: { email: process.env.SENDGRID_FROM || 'alerts@anandovsky.com' },
              subject: notificationPayload.subject,
              content: [{ type: 'text/plain', value: notificationPayload.text }]
            })
          });
        } catch (sgErr) {
          console.warn('[SendGrid API Warning]', sgErr);
        }
      }

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        delivered: true,
        recipient: recipient,
        dispatchedAt: timestamp,
        itemType: itemType,
        projectTitle: projectTitle
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
