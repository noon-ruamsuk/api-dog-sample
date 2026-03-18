import { createRoute, z } from '@hono/zod-openapi';
import { OpenAPIHono } from '@hono/zod-openapi';

// Schema definitions
const PostSchema = z.object({
  id: z.number().openapi({
    example: 1,
  }),
  title: z.string().openapi({
    example: 'My First Post',
  }),
  content: z.string().openapi({
    example: 'This is the content of my first post.',
  }),
  authorId: z.number().openapi({
    example: 1,
  }),
  createdAt: z.string().openapi({
    example: '2024-01-01T00:00:00Z',
  }),
  updatedAt: z.string().openapi({
    example: '2024-01-01T00:00:00Z',
  }),
});

const CreatePostSchema = z.object({
  title: z.string().min(1).openapi({
    example: 'My First Post',
  }),
  content: z.string().min(1).openapi({
    example: 'This is the content of my first post.',
  }),
  authorId: z.number().openapi({
    example: 1,
  }),
});

const UpdatePostSchema = CreatePostSchema.partial();

// In-memory storage
let posts: Post[] = [
  { 
    id: 1, 
    title: 'Getting Started with Hono', 
    content: 'Hono is a fast web framework...', 
    authorId: 1, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: 2, 
    title: 'Building CRUD APIs', 
    content: 'Creating CRUD operations is fundamental...', 
    authorId: 2, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

type Post = z.infer<typeof PostSchema>;

const app = new OpenAPIHono();

// GET /posts - List all posts
const getPostsRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(PostSchema),
        },
      },
      description: 'List all posts',
    },
  },
});

app.openapi(getPostsRoute, (c) => {
  return c.json(posts);
});

// GET /posts/:id - Get a specific post
const getPostRoute = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: z.object({
      id: z.string().openapi({
        param: { style: 'simple' },
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostSchema,
        },
      },
      description: 'Get a specific post',
    },
    404: {
      description: 'Post not found',
    },
  },
});

app.openapi(getPostRoute, (c) => {
  const id = parseInt(c.req.param('id'));
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return c.json({ error: 'Post not found' }, 404);
  }
  
  return c.json(post);
});

// POST /posts - Create a new post
const createPostRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreatePostSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: PostSchema,
        },
      },
      description: 'Post created successfully',
    },
    400: {
      description: 'Invalid input',
    },
  },
});

app.openapi(createPostRoute, (c) => {
  const body = c.req.valid('json');
  const now = new Date().toISOString();
  const newPost: Post = {
    id: Math.max(...posts.map(p => p.id)) + 1,
    ...body,
    createdAt: now,
    updatedAt: now,
  };
  
  posts.push(newPost);
  return c.json(newPost, 201);
});

// PUT /posts/:id - Update a post
const updatePostRoute = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: z.object({
      id: z.string().openapi({
        param: { style: 'simple' },
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdatePostSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostSchema,
        },
      },
      description: 'Post updated successfully',
    },
    404: {
      description: 'Post not found',
    },
  },
});

app.openapi(updatePostRoute, (c) => {
  const id = parseInt(c.req.param('id'));
  const body = c.req.valid('json');
  
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return c.json({ error: 'Post not found' }, 404);
  }
  
  posts[postIndex] = { 
    ...posts[postIndex], 
    ...body, 
    updatedAt: new Date().toISOString() 
  };
  return c.json(posts[postIndex]);
});

// DELETE /posts/:id - Delete a post
const deletePostRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  request: {
    params: z.object({
      id: z.string().openapi({
        param: { style: 'simple' },
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Post deleted successfully',
    },
    404: {
      description: 'Post not found',
    },
  },
});

app.openapi(deletePostRoute, (c) => {
  const id = parseInt(c.req.param('id'));
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return c.json({ error: 'Post not found' }, 404);
  }
  
  posts.splice(postIndex, 1);
  return c.json({ message: 'Post deleted successfully' });
});

export { app as postRoutes };
