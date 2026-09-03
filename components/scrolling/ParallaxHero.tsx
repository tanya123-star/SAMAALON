import Link from "next/link";

interface ParallaxHeroProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  imageUrl?: string;
}

export function ParallaxHero({
  title = "Discover the Unspoiled Havens of Samal",
  subtitle = "Explore white sand coves, hidden cliffside beaches, and authentic resorts across Davao's premier tropical island sanctuary.",
  badge = "Island Garden City of Samal",
  imageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85",
}: ParallaxHeroProps) {
  return (
    <section className="relative h-[85vh] min-h-[620px] w-full flex items-center justify-center overflow-hidden bg-[#1C2A28]">
      {/* Background Image Layer - static */}
      <div className="absolute inset-0 z-0">
        <img src={imageUrl} alt="Samal Island Hero" className="w-full h-full object-cover" />
        {/* Gradient Overlay for Editorial Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C2A28]/60 via-[#1C2A28]/35 to-[#FAF8F5]" />
      </div>

      {/* Hero Foreground Text Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.12]">{title}</h1>
        <p className="mt-6 text-sm sm:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-sm">{subtitle}</p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <Link href="/beaches" className="w-full sm:w-auto rounded-full bg-[#2D6A4F] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[#1C2A28] hover:shadow-2xl shadow-lg border border-emerald-500/30">
            Explore Beaches & Coves
          </Link>
          <Link href="/about" className="w-full sm:w-auto rounded-full bg-white/20 backdrop-blur-md border border-white/35 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-[#1C2A28]">
            Ferry & Travel Info
          </Link>
        </div>
      </div>
    </section>
  );
}
