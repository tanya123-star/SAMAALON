import { describe, it, expect } from "vitest"
import { beachSchema } from "../validations/beach"
import { accommodationSchema } from "../validations/accommodation"
import { blogPostSchema, blogCategorySchema } from "../validations/blog"
import { roomTypeSchema } from "../validations/roomType"
import { createReviewSchema } from "../validations/review"
import { searchParamsSchema, parseSearchParams } from "../validations/search"

describe("beachSchema", () => {
  const valid = {
    name: "Paradise Beach",
    slug: "paradise-beach",
    location: "Samal",
    description: "Nice beach",
  }
  it("accepts valid beach", () => {
    expect(beachSchema.safeParse(valid).success).toBe(true)
  })
  it("rejects invalid slug uppercase", () => {
    expect(beachSchema.safeParse({ ...valid, slug: "Bad_Slug" }).success).toBe(
      false
    )
  })
  it("rejects empty name", () => {
    expect(beachSchema.safeParse({ ...valid, name: "" }).success).toBe(false)
  })
  it("accepts optional googleMapsUrl valid URL", () => {
    expect(
      beachSchema.safeParse({
        ...valid,
        googleMapsUrl: "https://maps.google.com/?q=1",
      }).success
    ).toBe(true)
  })
  it("accepts empty googleMapsUrl as /uploads path guard", () => {
    expect(beachSchema.safeParse({ ...valid, googleMapsUrl: "" }).success).toBe(
      true
    )
  })
})

describe("accommodationSchema", () => {
  const valid = {
    name: "Paradise Resort",
    slug: "paradise-resort",
    description: "Beachfront",
    beachId: "cuid123cuid123cuid123cuid1",
  }
  it("accepts valid accommodation", () => {
    // zod cuid validation requires specific format, use a valid cuid
    const validCuid = "cl123456789012345678901234"
    expect(
      accommodationSchema.safeParse({ ...valid, beachId: validCuid }).success
    ).toBe(true)
  })
  it("rejects invalid facebookUrl", () => {
    expect(
      accommodationSchema.safeParse({
        name: "x",
        slug: "x",
        description: "d",
        beachId: "cl123456789012345678901234",
        facebookUrl: "not-url",
      }).success
    ).toBe(false)
  })
})

describe("blogPostSchema & blogCategorySchema", () => {
  it("accepts valid blog post", () => {
    expect(
      blogPostSchema.safeParse({
        title: "Hello",
        slug: "hello",
        content: "World",
        categoryId: "",
      }).success
    ).toBe(true)
  })
  it("rejects invalid slug", () => {
    expect(
      blogPostSchema.safeParse({ title: "t", slug: "Bad Slug", content: "c" })
        .success
    ).toBe(false)
  })
  it("accepts valid category", () => {
    expect(
      blogCategorySchema.safeParse({ name: "Travel", slug: "travel" }).success
    ).toBe(true)
  })
  it("rejects category invalid slug", () => {
    expect(
      blogCategorySchema.safeParse({ name: "x", slug: "Invalid!" }).success
    ).toBe(false)
  })
})

describe("roomTypeSchema", () => {
  it("accepts valid room type", () => {
    expect(
      roomTypeSchema.safeParse({
        name: "Deluxe",
        price: 100,
        accommodationId: "cl123456789012345678901234",
      }).success
    ).toBe(true)
  })
  it("rejects negative price", () => {
    expect(
      roomTypeSchema.safeParse({
        name: "x",
        price: -1,
        accommodationId: "cl123456789012345678901234",
      }).success
    ).toBe(false)
  })
  it("accepts empty imageUrl", () => {
    expect(
      roomTypeSchema.safeParse({
        name: "x",
        price: 10,
        accommodationId: "cl123456789012345678901234",
        imageUrl: "",
      }).success
    ).toBe(true)
  })
})

describe("createReviewSchema", () => {
  const cuid = "cl123456789012345678901234"
  it("accepts beach review", () => {
    expect(
      createReviewSchema.safeParse({
        rating: 5,
        comment: "Great",
        beachId: cuid,
      }).success
    ).toBe(true)
  })
  it("accepts accommodation review", () => {
    expect(
      createReviewSchema.safeParse({
        rating: 4,
        comment: "Nice",
        accommodationId: cuid,
      }).success
    ).toBe(true)
  })
  it("rejects both beach and accommodation (XOR)", () => {
    expect(
      createReviewSchema.safeParse({
        rating: 5,
        comment: "x",
        beachId: cuid,
        accommodationId: cuid,
      }).success
    ).toBe(false)
  })
  it("rejects neither target", () => {
    expect(
      createReviewSchema.safeParse({ rating: 5, comment: "x" }).success
    ).toBe(false)
  })
  it("rejects rating out of range", () => {
    expect(
      createReviewSchema.safeParse({ rating: 6, comment: "x", beachId: cuid })
        .success
    ).toBe(false)
  })
})

describe("searchParamsSchema & parseSearchParams", () => {
  it("parses amenities string to array", () => {
    const res = searchParamsSchema.parse({ amenities: "Swimming,WiFi" })
    expect(res.amenities).toEqual(["Swimming", "WiFi"])
  })
  it("parses amenities array with commas", () => {
    const res = parseSearchParams({ amenities: ["Swimming,WiFi", "Parking"] })
    expect(res.amenities).toEqual(["Swimming", "WiFi", "Parking"])
  })
  it("accepts empty and defaults page 1", () => {
    const res = searchParamsSchema.parse({})
    expect(res.page).toBe(1)
  })
  it("rejects rating over 5", () => {
    expect(searchParamsSchema.safeParse({ rating: 10 }).success).toBe(false)
  })
})
