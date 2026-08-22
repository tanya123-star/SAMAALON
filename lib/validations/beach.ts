import { z } from "zod";

export const beachSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphen"),
  location: z.string().min(1).max(100),
  description: z.string().min(1).max(5000),
  entranceFee: z.coerce.number().min(0).optional(),
  openingHours: z.string().max(100).optional(),
  contactInfo: z.string().max(200).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),
  amenities: z.array(z.string()).optional(),
});

export type BeachInput = z.infer<typeof beachSchema>;
