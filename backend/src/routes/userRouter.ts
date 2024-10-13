import { Hono } from 'hono';

const userRouter = new Hono();

userRouter.post('/signup', (c) => {
  return c.json({ message: 'Sign Up ' });
});

userRouter.post('/signin', (c) => {
  return c.json({ message: 'Signin' });
});

export default userRouter;
