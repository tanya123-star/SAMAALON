import { z } from "zod";

export const accommodationSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  priceRange: z.string().optional(),
  facebookUrl: z.string()
  .url()
  .optional()
  .or(z.string().refine((v) => v === "" || v.startsWith("/uploads/"), { message: "Must be a valid URL or /uploads/ path" })),
  beachId: z.string().cuid(),
});
