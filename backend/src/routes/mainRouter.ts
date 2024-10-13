import { Hono } from 'hono';
import userRouter from './userRouter';
import blogRouter from './blogRouter';

const apiv1 = new Hono();

apiv1.route('/user', userRouter);
apiv1.route('/', blogRouter);

export default apiv1;
