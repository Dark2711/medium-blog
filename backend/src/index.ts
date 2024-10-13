import { Hono } from 'hono';
import apiv1 from './routes/mainRouter';
const app = new Hono();

app.route('/api/v1', apiv1);

export default app;
