import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[#1C2A28]/10 bg-[#FAF8F5] pt-16 pb-12 text-[#5A6B68]">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-[#1C2A28]/10 pb-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-[0.25em] text-[#1C2A28]"
            >
              SAMAALON
            </Link>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-[#5A6B68]">
              Samaalon is an independent, minimalist travel discovery platform
              dedicated to showcasing the unspoiled coves, resorts, and island
              culture of Samal Island, Philippines.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-widest text-[#1C2A28] uppercase">
              Discover
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/beaches"
                  className="transition-colors hover:text-[#2D6A4F]"
                >
                  Beaches & Coves
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-[#2D6A4F]"
                >
                  Travel Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-[#2D6A4F]"
                >
                  About Samal Island
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-widest text-[#1C2A28] uppercase">
              Information
            </h4>
            <p className="text-xs leading-relaxed">
              Reservations are handled directly via resort Facebook pages.
              Samaalon processes no payments or bookings.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[11px] sm:flex-row">
          <p>
            © {new Date().getFullYear()} SAMAALON. Island Garden City of Samal,
            Philippines.
          </p>
          <p className="text-[#5A6B68]/70">
            Curated with minimalist tropical design.
          </p>
        </div>
      </div>
    </footer>
  )
}
