import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6">
      <h2 className="text-lg font-semibold">Beach not found</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Check the URL or browse all beaches.
      </p>
      <Link
        href="/beaches"
        className="text-primary mt-4 inline-block text-sm hover:underline"
      >
        ← Back to Beaches
      </Link>
    </div>
  )
}
