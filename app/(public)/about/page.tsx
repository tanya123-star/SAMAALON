import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* Editorial Header */}
      <section className="border-b border-[#1C2A28]/10 bg-white px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold tracking-[0.25em] text-[#2D6A4F] uppercase">
            Discover Davao&apos;s Tropical Haven
          </span>
          <h1 className="mt-2 font-serif text-4xl font-bold text-[#1C2A28] sm:text-6xl">
            About Samal Island
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed font-light text-[#5A6B68] sm:text-base">
            Island Garden City of Samal (IGACOS) — a paradise of white sand
            shorelines, turquoise marine sanctuaries, lush coconut palm groves,
            and rich island culture.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="mx-auto w-full max-w-4xl space-y-16 px-4 py-16 sm:px-8">
        {/* Geography & Overview */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#E07A5F] uppercase">
              The Geography
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1C2A28] sm:text-3xl">
              An Island City in Davao Gulf
            </h2>
            <p className="text-xs leading-relaxed text-[#5A6B68] sm:text-sm">
              Located directly across the Davao Gulf from Davao City, Samal
              Island spans over 300 square kilometers of coastal coves,
              limestone cliffs, and mangrove forests. It encompasses the
              district of Babak, Peñaplata, Kaputian, and the famous satellite
              island of Talikud.
            </p>
          </div>
          <div className="h-72 overflow-hidden rounded-2xl bg-slate-200 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
              alt="Samal Aerial Beach"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Step-by-Step Ferry & Getting There */}
        <div className="space-y-8 rounded-2xl border border-[#1C2A28]/10 bg-white p-8 shadow-sm sm:p-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#2D6A4F] uppercase">
              Transportation Guide
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#1C2A28] sm:text-3xl">
              How to Get to Samal Island
            </h2>
            <p className="mt-2 text-xs text-[#5A6B68]">
              Reaching Samal from Davao City is simple, fast, and operates round
              the clock.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-[#1C2A28]/10 bg-[#FAF8F5] p-5">
              <span className="mb-2 block text-xs font-bold tracking-widest text-[#2D6A4F] uppercase">
                Step 1: Ferry Wharf
              </span>
              <h3 className="font-serif text-base font-bold text-[#1C2A28]">
                Sasa Wharf / MaeWess
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5A6B68]">
                Take a taxi or jeepney to Sasa Ferry Terminal in Davao City.
                Ferries run every 15–20 minutes to Babak Port.
              </p>
            </div>

            <div className="rounded-xl border border-[#1C2A28]/10 bg-[#FAF8F5] p-5">
              <span className="mb-2 block text-xs font-bold tracking-widest text-[#2D6A4F] uppercase">
                Step 2: Boat Ride
              </span>
              <h3 className="font-serif text-base font-bold text-[#1C2A28]">
                15-Minute Crossing
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5A6B68]">
                Enjoy a breezy 15-minute ferry crossing across Davao Gulf
                (₱15–₱30 passenger fare, vehicle options available).
              </p>
            </div>

            <div className="rounded-xl border border-[#1C2A28]/10 bg-[#FAF8F5] p-5">
              <span className="mb-2 block text-xs font-bold tracking-widest text-[#2D6A4F] uppercase">
                Step 3: Island Transit
              </span>
              <h3 className="font-serif text-base font-bold text-[#1C2A28]">
                Habal-Habal & Tricycle
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5A6B68]">
                Upon arrival at Babak Port, hire a local habal-habal motorcycle
                or tricycle to reach your chosen beach or resort.
              </p>
            </div>
          </div>
        </div>

        {/* What Samaalon Does */}
        <div className="space-y-4 rounded-2xl bg-[#1C2A28] p-10 text-center text-white sm:p-14">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#E07A5F] uppercase">
            The Samaalon Philosophy
          </span>
          <h2 className="font-serif text-2xl font-bold sm:text-4xl">
            Discovery Without Clutter
          </h2>
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
            Samaalon centralizes authentic beach data, entrance fees, Google
            Maps directions, and resort contacts. We do not charge booking fees
            or force complex payment forms — all reservations happen directly
            through official resort Facebook Messenger pages.
          </p>
          <div className="pt-4">
            <Link
              href="/beaches"
              className="rounded-full bg-[#E07A5F] px-8 py-3.5 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-[#1C2A28]"
            >
              Start Exploring Samal Beaches
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
