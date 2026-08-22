import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#1C2A28]/10 bg-[#FAF8F5] pt-16 pb-12 text-[#5A6B68]">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1C2A28]/10">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-bold tracking-[0.25em] text-[#1C2A28]">
              SAMAALON
            </Link>
            <p className="mt-4 text-xs leading-relaxed max-w-md text-[#5A6B68]">
              Samaalon is an independent, minimalist travel discovery platform dedicated to showcasing the unspoiled coves, resorts, and island culture of Samal Island, Philippines.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1C2A28] mb-4">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/beaches" className="hover:text-[#2D6A4F] transition-colors">Beaches & Coves</Link></li>
              <li><Link href="/blog" className="hover:text-[#2D6A4F] transition-colors">Travel Guides</Link></li>
              <li><Link href="/about" className="hover:text-[#2D6A4F] transition-colors">About Samal Island</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1C2A28] mb-4">Information</h4>
            <p className="text-xs leading-relaxed">
              Reservations are handled directly via resort Facebook pages. Samaalon processes no payments or bookings.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4">
          <p>© {new Date().getFullYear()} SAMAALON. Island Garden City of Samal, Philippines.</p>
          <p className="text-[#5A6B68]/70">Curated with minimalist tropical design.</p>
        </div>
      </div>
    </footer>
  );
}
