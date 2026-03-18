import { createRoute, z } from '@hono/zod-openapi';
import { OpenAPIHono } from '@hono/zod-openapi';

// Schema definitions
const UserSchema = z.object({
  id: z.number().openapi({
    example: 1,
  }),
  name: z.string().openapi({
    example: 'John Doe',
  }),
  email: z.string().email().openapi({
    example: 'john@example.com',
  }),
  role: z.string().optional().openapi({
    example: 'user',
  }),
  createdAt: z.string().openapi({
    example: '2024-01-01T00:00:00Z',
  }),
});

const CreateUserSchema = z.object({
  name: z.string().min(1).openapi({
    example: 'John Doe',
  }),
  email: z.string().email().openapi({
    example: 'john@example.com',
  }),
  role: z.string().optional().openapi({
    example: 'user',
  }),
});

const UpdateUserSchema = CreateUserSchema.partial();

// In-memory storage
let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString() },
];

type User = z.infer<typeof UserSchema>;

const app = new OpenAPIHono();

// GET /users - List all users
const getUsersRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(UserSchema),
        },
      },
      description: 'List all users',
    },
  },
});

app.openapi(getUsersRoute, (c) => {
  return c.json(users);
});

// GET /users/:id - Get a specific user
const getUserRoute = createRoute({
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
          schema: UserSchema,
        },
      },
      description: 'Get a specific user',
    },
    404: {
      description: 'User not found',
    },
  },
});

app.openapi(getUserRoute, (c) => {
  const id = parseInt(c.req.param('id'));
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  return c.json(user);
});

// POST /users - Create a new user
const createUserRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'User created successfully',
    },
    400: {
      description: 'Invalid input',
    },
  },
});

app.openapi(createUserRoute, (c) => {
  const body = c.req.valid('json');
  const newUser: User = {
    id: Math.max(...users.map(u => u.id)) + 1,
    ...body,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  return c.json(newUser, 201);
});

// PUT /users/:id - Update a user
const updateUserRoute = createRoute({
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
          schema: UpdateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'User updated successfully',
    },
    404: {
      description: 'User not found',
    },
  },
});

app.openapi(updateUserRoute, (c) => {
  const id = parseInt(c.req.param('id'));
  const body = c.req.valid('json');
  
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  users[userIndex] = { ...users[userIndex], ...body };
  return c.json(users[userIndex]);
});

// DELETE /users/:id - Delete a user
const deleteUserRoute = createRoute({
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
      description: 'User deleted successfully',
    },
    404: {
      description: 'User not found',
    },
  },
});

app.openapi(deleteUserRoute, (c) => {
  const id = parseInt(c.req.param('id'));
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  users.splice(userIndex, 1);
  return c.json({ message: 'User deleted successfully' });
});

export { app as userRoutes };
