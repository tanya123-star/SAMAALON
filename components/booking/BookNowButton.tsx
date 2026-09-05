import Link from "next/link"
import { auth } from "@/lib/auth"

export async function BookNowButton({
  facebookUrl,
  accommodationName,
  slug,
}: {
  facebookUrl: string
  accommodationName: string
  slug?: string
}) {
  const session = await auth()
  if (!session) {
    const callbackUrl = slug ? `/accommodations/${slug}` : "/"
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        className="bg-primary text-primary-foreground inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium"
      >
        Login to Book {accommodationName}
      </Link>
    )
  }
  return (
    <a
      href={facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-primary text-primary-foreground inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium"
    >
      Book Now
    </a>
  )
}
