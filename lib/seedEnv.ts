export function assertSafeSeedEnv(url: string, argv: string[]): void {
  if (!url)
    throw new Error(
      "Missing DATABASE_URL / PREVIEW_DATABASE_URL for seed. Set PREVIEW_DATABASE_URL locally, never commit it."
    )
  const allowProd = argv.includes("--allow-prod")
  const looksProd = url.includes("nnczxxdmmzpqaptinxsw")
  if (looksProd && !allowProd) {
    throw new Error(
      "Refusing to seed what looks like PROD. Use PREVIEW_DATABASE_URL or pass --allow-prod for deliberate prod baseline."
    )
  }
}
export function resolveSeedUrl(argv: string[]): string {
  const isPreview = argv.includes("--preview")
  const url = isPreview
    ? process.env.PREVIEW_DATABASE_URL
    : process.env.DATABASE_URL
  if (!url)
    throw new Error(
      isPreview ? "Missing PREVIEW_DATABASE_URL" : "Missing DATABASE_URL"
    )
  assertSafeSeedEnv(url, argv)
  return url
}
