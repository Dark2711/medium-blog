import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode, sign, verify } from 'hono/jwt';
const jwtSecret = 'mytopsecretkey';
const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

// In app.ts or userRouter.ts
userRouter.use('*', (c, next) => {
  console.log(`Incoming request: ${c.req.method} ${c.req.url}`);
  return next();
});

userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existingUser) {
    return c.json({ message: 'User already exists' });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });

    const payload = {
      userID: user.id,
    };
    const token = await sign(payload, jwtSecret);
    console.log('After token creation');
    console.log(token);

    return c.json({
      messgae: 'User created',
      token: token,
    });
  } catch (e) {
    console.error('Error creating user:', e); // Log the error details
    return c.json({ message: 'Error creating user' });
  }
});

userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return c.json({ message: 'User not found' });
  }

  const isPasswordValid = user.password === body.password;
  if (!isPasswordValid) {
    return c.json({ message: 'Invalid password' });
  }

  const token = await sign({ id: user.id }, jwtSecret);
  return c.json({ message: 'Successfully Signed In', token });
});

export default userRouter;
