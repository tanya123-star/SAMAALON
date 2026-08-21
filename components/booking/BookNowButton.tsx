import Link from "next/link";
import { auth } from "@/lib/auth";

export async function BookNowButton({ facebookUrl, accommodationName }: { facebookUrl: string; accommodationName: string }) {
  const session = await auth();
  if (!session) {
    return (
      <Link href="/api/auth/signin" className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
        Login to Book {accommodationName}
      </Link>
    );
  }
  return (
    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
      Book Now → Facebook
    </a>
  );
}
