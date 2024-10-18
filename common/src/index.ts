import { z } from 'zod'

export const signupInput = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
})

export type signupType = z.infer<typeof signupInput>

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type signinType = z.infer<typeof signinInput>

export const createPostInput = z.object({
  title: z.string(),
  content: z.string(),
})

export type CreatePostType = z.infer<typeof createPostInput>

export const updatePostInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
})

export type UpdatePostType = z.infer<typeof updatePostInput>
