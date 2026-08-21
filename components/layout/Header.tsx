import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/beaches", label: "Beaches" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Samal" },
];

export async function Header() {
  const session = await auth();
  const user = session?.user as unknown as { name?: string; email?: string; image?: string; role?: string } | undefined;
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-bold tracking-[0.2em]">
          SAMAALON
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/profile" className="hidden text-sm hover:underline md:inline">
                {user?.name ?? user?.email}
              </Link>
              {user?.role === "ADMIN" ? (
                <Link href="/admin" className="text-xs font-medium text-primary hover:underline">
                  Admin
                </Link>
              ) : null}
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="inline-flex h-7 items-center rounded-md px-2.5 text-sm font-medium hover:bg-muted">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link href="/api/auth/signin" className="inline-flex h-7 items-center rounded-md px-2.5 text-sm font-medium hover:bg-muted">
              Login
            </Link>
          )}
          <nav className="flex items-center gap-4 text-sm md:hidden">
            {navLinks.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
