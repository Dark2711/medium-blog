import { Hono } from 'hono';

const blogRouter = new Hono();

blogRouter.post('/blog', (c) => {
  return c.json({ message: 'Post blog route' });
});

blogRouter.put('/blog', (c) => {
  return c.json({ message: 'Put blog route' });
});

blogRouter.get('/blog/bulk', (c) => {
  return c.json({ message: 'get all the blogs' });
});
blogRouter.get('/blog/:id', (c) => {
  const id = c.req.param('id');
  console.log(id);
  return c.text('get specific blog route');
});

export default blogRouter;
