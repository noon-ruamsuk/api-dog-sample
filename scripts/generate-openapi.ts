#!/usr/bin/env tsx

import { OpenAPIHono } from '@hono/zod-openapi';
import { userRoutes } from '../src/routes/users';
import { postRoutes } from '../src/routes/posts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOpenAPISpec() {
  try {
    const app = new OpenAPIHono();
    
    // Register routes
    app.route('/api/users', userRoutes);
    app.route('/api/posts', postRoutes);
    
    // Generate OpenAPI spec
    const openAPISpec = app.getOpenAPIDocument({
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Hono CRUD API',
        description: 'Sample CRUD API using Hono framework with Scalar OpenAPI documentation',
      },
      servers: [
        {
          url: 'https://api.example.com',
          description: 'Production server',
        },
        {
          url: 'http://localhost:4005',
          description: 'Development server',
        },
      ],
    });
    
    // Write to file
    const outputPath = path.join(__dirname, '..', 'openapi.json');
    fs.writeFileSync(outputPath, JSON.stringify(openAPISpec, null, 2));
    
    console.log('✅ OpenAPI specification generated successfully!');
    console.log(`📄 Output file: ${outputPath}`);
    console.log(`📊 Generated ${Object.keys(openAPISpec.paths || {}).length} API endpoints`);
    
  } catch (error) {
    console.error('❌ Error generating OpenAPI specification:', error);
    process.exit(1);
  }
}

generateOpenAPISpec();
