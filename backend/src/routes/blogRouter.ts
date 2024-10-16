import { Hono } from 'hono';
import auth from '../middlewares/auth';
import { createBlog, fetchAllBlogs, getBlog, updateBlog } from '../controllers/blog.controller';
const blogRouter = new Hono();

blogRouter.use('/blog', auth);

// create blog
blogRouter.post('/blog', createBlog);

//update blog
blogRouter.put('/blog', updateBlog);

// get all the blogs
blogRouter.get('/blog/bulk', fetchAllBlogs);

// get blog by id in param
blogRouter.get('/blog/:id', getBlog);

export default blogRouter;
