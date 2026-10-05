// ==============================================================================
// StyleHub – Experiment 7: Basic Node.js HTTP Server
// Concept: Built-in 'http' Module (No external frameworks like Express)
// File: node-basics/http-server.js
// Execution: node node-basics/http-server.js
// ==============================================================================

import http from 'http';

const PORT = 4000;
const HOST = '127.0.0.1';

// Create native HTTP server using http.createServer()
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toLocaleTimeString()}] Incoming Request: ${req.method} ${req.url}`);

  // Set HTTP response status code and headers
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // Simple routing demonstration using native Node.js
  if (req.url === '/' || req.url === '/status') {
    res.end(`
      <html>
        <head>
          <title>StyleHub Node.js Core Server</title>
          <style>
            body { font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center; }
            h1 { color: #d4af37; }
            .card { background: #1e293b; padding: 20px; border-radius: 8px; display: inline-block; margin-top: 20px; }
            .badge { background: #22c55e; color: #fff; padding: 4px 10px; border-radius: 4px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>StyleHub Node.js Server Running</h1>
          <div class="card">
            <p><span class="badge">HTTP 200 OK</span> Native Node.js Server without Express</p>
            <p>Server Port: <strong>${PORT}</strong> | Protocol: <strong>HTTP/1.1</strong></p>
            <p>API Endpoint: <code>http://${HOST}:${PORT}/api/info</code></p>
          </div>
        </body>
      </html>
    `);
  } else if (req.url === '/api/info') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: "success",
      message: "StyleHub Node.js Server Running",
      server: "Node.js Native HTTP Server",
      timestamp: new Date().toISOString()
    }));
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 Not Found - StyleHub Core HTTP Server');
  }
});

// Start listening for incoming network requests
server.listen(PORT, HOST, () => {
  console.log(`=====================================================`);
  console.log(`  StyleHub Native HTTP Server Running!`);
  console.log(`  URL: http://${HOST}:${PORT}/`);
  console.log(`  Message returned: "StyleHub Node.js Server Running"`);
  console.log(`=====================================================`);
  console.log(`Press Ctrl+C to terminate the server.`);
});
