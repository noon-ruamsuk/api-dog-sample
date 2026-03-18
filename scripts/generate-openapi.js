#!/usr/bin/env node

const { OpenAPIHono } = require('@hono/zod-openapi');
const fs = require('fs');
const path = require('path');

async function generateOpenAPISpec() {
  try {
    const app = new OpenAPIHono();
    
    // Import the compiled routes
    const userRoutesModule = require('../dist/routes/users');
    const postRoutesModule = require('../dist/routes/posts');
    
    // Register routes
    app.route('/api/users', userRoutesModule.userRoutes);
    app.route('/api/posts', postRoutesModule.postRoutes);
    
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
