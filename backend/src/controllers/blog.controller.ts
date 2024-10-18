import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Context } from 'hono';
import { createPostInput, updatePostInput } from '@dark2711/common';

export async function createBlog(c: Context) {
  const userID = c.get('userID');
  console.log(userID);
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const user = await prisma.user.findUnique({
    where: {
      id: userID,
    },
  });
  console.log(user);

  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: 'Invalid Inputs' });
  }
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userID,
        // author: user?.name, // Removed because it expects a nested object
      },
    });
    return c.json({
      id: post.id,
    });
  } catch (e) {
    console.error('Error creating post:', e); // Log the error
    return c.json({ error: 'Failed to create post' }, 500);
  }
}

export async function updateBlog(c: Context) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: 'Invalid Inputs' });
  }
  const post = await prisma.post.findUnique({
    where: {
      id: body.id,
    },
  });

  if (!post) {
    c.status(404);
    return c.json({
      message: 'post not found with given id',
    });
  }
  try {
    const update = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({
      // Return the updated post
      id: update.id,
      message: 'Post updated successfully',
      update, // Optionally return the entire updated post object
    });
  } catch (e) {
    console.error('Error updating post:', e); // Log the error
    return c.json({ error: 'Failed to update post' }, 500);
  }
}

export async function fetchAllBlogs(c: Context) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const allBlogs = await prisma.post.findMany();
    return c.json({
      Blogs: allBlogs,
    });
  } catch (e) {
    console.error('Error fetching post:', e);
    return c.json({ error: 'Failed to fetch post' }, 500);
  }
}

export async function getBlog(c: Context) {
  const id = c.req.param('id');

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    return c.json({
      blog,
    });
  } catch (error) {}
}
