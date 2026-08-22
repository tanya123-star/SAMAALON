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
    <header className="sticky top-0 z-50 w-full border-b border-[#1C2A28]/10 glass-nav transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="font-serif text-xl font-bold tracking-[0.25em] text-[#1C2A28]">
          SAMAALON
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#5A6B68] md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[#1C2A28] py-1 border-b border-transparent hover:border-[#2D6A4F]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 text-xs font-medium text-[#1C2A28] hover:text-[#2D6A4F]">
                {user?.image ? (
                  <img src={user.image} alt={user.name || "User"} className="w-7 h-7 rounded-full border border-[#2D6A4F]/20 object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.[0] || "U"}
                  </div>
                )}
                <span className="hidden sm:inline font-semibold">{user?.name?.split(" ")[0] || "Profile"}</span>
              </Link>

              {user?.role === "ADMIN" && (
                <Link href="/admin" className="rounded-full bg-[#1C2A28] px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider hover:bg-[#2D6A4F] transition-all">
                  Admin
                </Link>
              )}

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="text-xs text-[#5A6B68] hover:text-[#1C2A28] transition-colors">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/api/auth/signin"
              className="rounded-full bg-[#1C2A28] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-[#2D6A4F] hover:shadow-md"
            >
              Login
            </Link>
          )}

          <nav className="flex items-center gap-3 text-xs font-medium text-[#5A6B68] md:hidden">
            {navLinks.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#1C2A28]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
