import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { signinInput, signupInput } from '@dark2711/common';

import { Context } from 'hono';

export async function signup(c: Context) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: 'Invalid Inputs' });
  }
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
    const token = await sign(payload, c.env.JWT_SECRET);
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
}

export async function signin(c: Context) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: 'Invalid Inputs' });
  }
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

  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ message: 'Successfully Signed In', token });
}
