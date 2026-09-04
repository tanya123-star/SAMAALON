import Link from "next/link"

interface ParallaxHeroProps {
  title?: string
  subtitle?: string
  badge?: string
  imageUrl?: string
}

export function ParallaxHero({
  title = "Discover the Unspoiled Havens of Samal",
  subtitle = "Explore white sand coves, hidden cliffside beaches, and authentic resorts across Davao's premier tropical island sanctuary.",
  badge = "Island Garden City of Samal",
  imageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85",
}: ParallaxHeroProps) {
  return (
    <section className="relative flex h-[85vh] min-h-[620px] w-full items-center justify-center overflow-hidden bg-[#1C2A28]">
      {/* Background Image Layer - static */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt="Samal Island Hero"
          className="h-full w-full object-cover"
        />
        {/* Gradient Overlay for Editorial Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C2A28]/60 via-[#1C2A28]/35 to-[#FAF8F5]" />
      </div>

      {/* Hero Foreground Text Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        <h1 className="font-serif text-4xl leading-[1.12] font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed font-light text-white/95 drop-shadow-sm sm:text-lg">
          {subtitle}
        </p>

        {/* Action Buttons */}
        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/beaches"
            className="w-full rounded-full border border-emerald-500/30 bg-[#2D6A4F] px-8 py-4 text-xs font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:bg-[#1C2A28] hover:shadow-2xl sm:w-auto"
          >
            Explore Beaches & Coves
          </Link>
          <Link
            href="/about"
            className="w-full rounded-full border border-white/35 bg-white/20 px-8 py-4 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-md transition-all hover:bg-white hover:text-[#1C2A28] sm:w-auto"
          >
            Ferry & Travel Info
          </Link>
        </div>
      </div>
    </section>
  )
}
