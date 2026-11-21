const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

loadEnvFile();

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'amitjangra523@gmail.com';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Sugatta Care <onboarding@resend.dev>';
const MIME_TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const recentRequests = new Map();

function loadEnvFile() {
  const file = path.join(__dirname, '.env');
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  });
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 20_000) reject(new Error('Request is too large'));
    });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('Invalid request')); }
    });
    req.on('error', reject);
  });
}

function clean(value, max = 2000) { return String(value || '').replace(/[<>]/g, '').trim().slice(0, max); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char])); }

async function sendContactEmail(data) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');
  const payload = {
    from: CONTACT_FROM_EMAIL,
    to: [CONTACT_TO_EMAIL],
    subject: `Sugatta Care website: ${data.reason}`,
    text: `New message from the Sugatta Care website\n\nName: ${data.name}\nPhone or email: ${data.contact}\nReason: ${data.reason}\n\n${data.message}`,
    html: `<h2>New Sugatta Care website message</h2><p><strong>Name:</strong> ${escapeHtml(data.name)}</p><p><strong>Phone or email:</strong> ${escapeHtml(data.contact)}</p><p><strong>Reason:</strong> ${escapeHtml(data.reason)}</p><hr><p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`
  };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact)) payload.reply_to = data.contact;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Resend could not send the email');
  return result;
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  if (requestUrl.pathname === '/api/contact' && req.method === 'POST') {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    if (recentRequests.has(ip) && now - recentRequests.get(ip) < 10_000) return sendJson(res, 429, { error: 'Please wait a few seconds before sending another message.' });
    recentRequests.set(ip, now);
    try {
      const body = await readBody(req);
      if (body.website) return sendJson(res, 200, { ok: true });
      const data = { name: clean(body.name, 100), contact: clean(body.contact, 160), reason: clean(body.reason, 80), message: clean(body.message, 4000) };
      if (!data.name || !data.contact || !data.reason || !data.message) return sendJson(res, 400, { error: 'Please complete all fields.' });
      await sendContactEmail(data);
      return sendJson(res, 200, { ok: true, message: 'Thank you. Your message has been sent to our team.' });
    } catch (error) {
      console.error('[contact]', error.message);
      const missingKey = error.message === 'RESEND_API_KEY is not configured';
      return sendJson(res, missingKey ? 503 : 500, { error: missingKey ? 'Email service is not configured yet.' : 'We could not send your message. Please try again.' });
    }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { error: 'Method not allowed' });
  const requested = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
  const filePath = path.resolve(ROOT, `.${requested}`);
  if (!filePath.startsWith(path.resolve(ROOT) + path.sep)) return sendJson(res, 403, { error: 'Forbidden' });
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) return sendJson(res, 404, { error: 'Not found' });
    res.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => console.log(`Sugatta Care website: http://localhost:${PORT}`));
