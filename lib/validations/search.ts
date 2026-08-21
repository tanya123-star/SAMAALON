import { z } from "zod";

export const searchParamsSchema = z.object({
  q: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  amenities: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      const arr = Array.isArray(v) ? v : [v];
      // handle comma-separated: ?amenities=Swimming,WiFi
      return arr
        .flatMap((s) => s.split(","))
        .map((s) => s.trim())
        .filter(Boolean);
    }),
  rating: z.coerce.number().min(0).max(5).optional(),
  priceRange: z.string().trim().max(50).optional(),
  maxGuests: z.coerce.number().int().min(1).max(20).optional(),
  sort: z.enum(["rating", "fee", "name", "newest"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export function parseSearchParams(input: Record<string, string | string[] | undefined>): SearchParams {
  return searchParamsSchema.parse(input);
}
