import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';

const auth = createMiddleware(async (c, next) => {
  const token = c.req.header('Authorization');

  if (!token) {
    c.status(401);
    return c.json({ message: 'Unauthorized' });
  }

  const decoded = (await verify(token, c.env.JWT_SECRET)) as { id: string };
  // console.log('Decoded:', decoded);

  if (!decoded) {
    return c.json({ message: 'Invalid token' });
  }
  c.set('userID', decoded.id);
  await next();
});

export default auth;
