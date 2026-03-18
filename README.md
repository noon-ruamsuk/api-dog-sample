# Hono CRUD API with Scalar OpenAPI

A sample CRUD API built with Hono framework featuring automatic OpenAPI documentation generation using Scalar UI.

## Features

- 🚀 Fast web framework built on Web Standards
- 📝 Automatic OpenAPI 3.0 documentation
- 🎨 Beautiful Scalar UI for API documentation
- ✅ Type-safe with Zod schemas
- 🔧 Full CRUD operations for Users and Posts
- 📦 TypeScript support

## API Endpoints

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Posts
- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Documentation
- `GET /swagger` - Interactive API documentation (Scalar UI)
- `GET /doc` - Raw OpenAPI JSON specification

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
- API: http://localhost:3000
- Documentation: http://localhost:3000/swagger
- OpenAPI Spec: http://localhost:3000/doc

## Usage Examples

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Create a Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post.",
    "authorId": 1
  }'
```

### Get All Posts
```bash
curl http://localhost:3000/api/posts
```

## Project Structure

```
src/
├── index.ts          # Main application entry point
├── routes/
│   ├── users.ts      # User CRUD routes
│   └── posts.ts      # Post CRUD routes
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

## Technologies Used

- **Hono** - Fast web framework
- **@hono/zod-openapi** - OpenAPI schema generation
- **@hono/swagger-ui** - Swagger UI integration
- **Zod** - TypeScript-first schema validation
- **Scalar** - Modern API documentation UI

## Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## License

MIT License
