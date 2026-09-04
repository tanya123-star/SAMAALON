import { z } from "zod"

export const roomTypeSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  price: z.coerce.number().min(0),
  maxGuests: z.coerce.number().int().min(1).max(20).optional(),
  amenities: z.string().max(1000).optional(),
  imageUrl: z
    .string()
    .url()
    .optional()
    .or(
      z.string().refine((v) => v === "" || v.startsWith("/uploads/"), {
        message: "Must be a valid URL or /uploads/ path",
      })
    ),
  accommodationId: z.string().cuid(),
})

export type RoomTypeInput = z.infer<typeof roomTypeSchema>
