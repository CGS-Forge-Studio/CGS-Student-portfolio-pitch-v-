import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'frontend');
const port = Number(process.env.PORT || 3000);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml' };
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' }).end('Not found');
  }
});

server.listen(port, 'localhost', () => {
  const url = `http://localhost:${port}`;
  console.log(`CGS HUB Student Portfolio is running at ${url}`);
  if (process.platform === 'win32') spawn('cmd', ['/c', 'start', '', url], { detached:true, stdio:'ignore' }).unref();
});
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
