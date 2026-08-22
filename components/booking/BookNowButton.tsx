import Link from "next/link";
import { auth } from "@/lib/auth";

export async function BookNowButton({ facebookUrl, accommodationName, slug }: { facebookUrl: string; accommodationName: string; slug?: string }) {
  const session = await auth();
  if (!session) {
    const callbackUrl = slug ? `/accommodations/${slug}` : "/";
    return (
      <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
        Login to Book {accommodationName}
      </Link>
    );
  }
  return (
    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
      Book Now
    </a>
  );
}
