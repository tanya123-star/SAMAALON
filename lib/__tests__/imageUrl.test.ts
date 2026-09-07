import { describe, it, expect } from "vitest"
import { validateRemoteImageUrl } from "../imageUrl"

describe("validateRemoteImageUrl", () => {
  it("accepts valid https image URL", () => {
    const res = validateRemoteImageUrl("https://example.com/img.jpg")
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.url).toBe("https://example.com/img.jpg")
  })

  it("accepts valid http image URL", () => {
    const res = validateRemoteImageUrl("http://example.com/photo.png")
    expect(res.ok).toBe(true)
  })

  it("rejects empty URL", () => {
    const res = validateRemoteImageUrl("   ")
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe("Empty URL")
  })

  it("rejects invalid URL format", () => {
    const res = validateRemoteImageUrl("not-a-url")
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toMatch(/https:\/\//)
  })

  it("rejects ftp protocol", () => {
    const res = validateRemoteImageUrl("ftp://example.com/img.jpg")
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toMatch(/https:\/\//)
  })

  it("rejects javascript protocol", () => {
    const res = validateRemoteImageUrl("javascript:alert(1)")
    expect(res.ok).toBe(false)
  })

  it("rejects unsplash page URL", () => {
    const res = validateRemoteImageUrl("https://unsplash.com/photos/abc123")
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toMatch(/images\.unsplash\.com/)
  })

  it("rejects subdomain unsplash page URL", () => {
    const res = validateRemoteImageUrl("https://foo.unsplash.com/photos/abc")
    expect(res.ok).toBe(false)
  })

  it("accepts direct unsplash image URL", () => {
    const res = validateRemoteImageUrl("https://images.unsplash.com/photo-123")
    expect(res.ok).toBe(true)
  })

  it("rejects markdown injection [ ]", () => {
    const res = validateRemoteImageUrl("https://example.com/img[1].jpg")
    expect(res.ok).toBe(false)
  })

  it("rejects HTML injection < >", () => {
    const res = validateRemoteImageUrl("https://example.com/<img>")
    expect(res.ok).toBe(false)
  })

  it("trims whitespace", () => {
    const res = validateRemoteImageUrl("  https://example.com/img.jpg  ")
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.url).toBe("https://example.com/img.jpg")
  })
})
