import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { userRoutes } from './routes/users';
import { postRoutes } from './routes/posts';

const app = new OpenAPIHono();

// OpenAPI configuration
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hono CRUD API',
    description: 'Sample CRUD API using Hono framework with Scalar OpenAPI documentation',
  },
  servers: [
    {
      url: 'http://localhost:4005',
      description: 'Development server',
    },
  ],
});

// Scalar UI for OpenAPI documentation
app.get('/swagger', swaggerUI({ url: '/doc' }));

// Routes
app.route('/api/users', userRoutes);
app.route('/api/posts', postRoutes);

// Health check
app.get('/', (c) => {
  return c.json({ message: 'Hono CRUD API is running!', timestamp: new Date().toISOString() });
});

export default {
  port: 4005,
  fetch: app.fetch,
};
