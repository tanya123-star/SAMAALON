import { describe, it, expect } from "vitest"
import { assertSafeSeedEnv } from "../seedEnv"

describe("assertSafeSeedEnv", () => {
  it("aborts when URL contains prod marker without --allow-prod", () => {
    expect(() =>
      assertSafeSeedEnv(
        "postgresql://postgres@db.nnczxxdmmzpqaptinxsw.supabase.co:5432/postgres",
        []
      )
    ).toThrow(/preview/i)
  })
  it("passes for preview URL", () => {
    expect(() =>
      assertSafeSeedEnv(
        "postgresql://postgres@db.preview-xyz.supabase.co:5432/postgres",
        ["--preview"]
      )
    ).not.toThrow()
  })
})
