import { Hono } from 'hono';
import { signup, signin } from '../controllers/user.controller';
const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post('/signup', signup);

userRouter.post('/signin', signin);

export default userRouter;
