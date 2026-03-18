import app from './index';

const port = 4005;

console.log(`🚀 Server is running on http://localhost:${port}`);
console.log(`📚 API Documentation: http://localhost:${port}/swagger`);
console.log(`📄 OpenAPI Spec: http://localhost:${port}/doc`);

// Node.js server with proper Hono integration
const { serve } = require('@hono/node-server');

serve({
  fetch: app.fetch,
  port,
});
