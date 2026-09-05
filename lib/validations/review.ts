import { z } from "zod"

export const createReviewSchema = z
  .object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().min(1).max(1000),
    beachId: z.string().cuid().optional(),
    accommodationId: z.string().cuid().optional(),
  })
  .refine((d) => (d.beachId ? !d.accommodationId : !!d.accommodationId), {
    message: "Review must target Beach OR Accommodation (XOR)",
    path: ["beachId"],
  })

export type CreateReviewInput = z.infer<typeof createReviewSchema>
