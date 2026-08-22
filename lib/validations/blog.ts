import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  content: z.string().min(1),
  categoryId: z.string().cuid().optional().or(z.literal("")),
  featuredImage: z.string().url().optional().or(z.literal("")),
});

export const blogCategorySchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;
