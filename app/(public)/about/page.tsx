import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* Editorial Header */}
      <section className="bg-white border-b border-[#1C2A28]/10 py-16 px-4 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2D6A4F]">Discover Davao&apos;s Tropical Haven</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1C2A28] mt-2">About Samal Island</h1>
          <p className="mt-4 text-xs sm:text-base text-[#5A6B68] max-w-2xl mx-auto leading-relaxed font-light">
            Island Garden City of Samal (IGACOS) — a paradise of white sand shorelines, turquoise marine sanctuaries, lush coconut palm groves, and rich island culture.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="mx-auto max-w-4xl w-full px-4 sm:px-8 py-16 space-y-16">
        {/* Geography & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F]">The Geography</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2A28]">An Island City in Davao Gulf</h2>
            <p className="text-xs sm:text-sm text-[#5A6B68] leading-relaxed">
              Located directly across the Davao Gulf from Davao City, Samal Island spans over 300 square kilometers of coastal coves, limestone cliffs, and mangrove forests. It encompasses the district of Babak, Peñaplata, Kaputian, and the famous satellite island of Talikud.
            </p>
          </div>
          <div className="h-72 rounded-2xl overflow-hidden shadow-md bg-slate-200">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
              alt="Samal Aerial Beach"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Step-by-Step Ferry & Getting There */}
        <div className="bg-white rounded-2xl border border-[#1C2A28]/10 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F]">Transportation Guide</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2A28] mt-1">How to Get to Samal Island</h2>
            <p className="mt-2 text-xs text-[#5A6B68]">Reaching Samal from Davao City is simple, fast, and operates round the clock.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-[#FAF8F5] p-5 border border-[#1C2A28]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] block mb-2">Step 1: Ferry Wharf</span>
              <h3 className="font-serif text-base font-bold text-[#1C2A28]">Sasa Wharf / MaeWess</h3>
              <p className="mt-2 text-xs text-[#5A6B68] leading-relaxed">
                Take a taxi or jeepney to Sasa Ferry Terminal in Davao City. Ferries run every 15–20 minutes to Babak Port.
              </p>
            </div>

            <div className="rounded-xl bg-[#FAF8F5] p-5 border border-[#1C2A28]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] block mb-2">Step 2: Boat Ride</span>
              <h3 className="font-serif text-base font-bold text-[#1C2A28]">15-Minute Crossing</h3>
              <p className="mt-2 text-xs text-[#5A6B68] leading-relaxed">
                Enjoy a breezy 15-minute ferry crossing across Davao Gulf (₱15–₱30 passenger fare, vehicle options available).
              </p>
            </div>

            <div className="rounded-xl bg-[#FAF8F5] p-5 border border-[#1C2A28]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] block mb-2">Step 3: Island Transit</span>
              <h3 className="font-serif text-base font-bold text-[#1C2A28]">Habal-Habal & Tricycle</h3>
              <p className="mt-2 text-xs text-[#5A6B68] leading-relaxed">
                Upon arrival at Babak Port, hire a local habal-habal motorcycle or tricycle to reach your chosen beach or resort.
              </p>
            </div>
          </div>
        </div>

        {/* What Samaalon Does */}
        <div className="text-center bg-[#1C2A28] text-white rounded-2xl p-10 sm:p-14 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E07A5F]">The Samaalon Philosophy</span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">Discovery Without Clutter</h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            Samaalon centralizes authentic beach data, entrance fees, Google Maps directions, and resort contacts. We do not charge booking fees or force complex payment forms — all reservations happen directly through official resort Facebook Messenger pages.
          </p>
          <div className="pt-4">
            <Link
              href="/beaches"
              className="rounded-full bg-[#E07A5F] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-[#1C2A28]"
            >
              Start Exploring Samal Beaches
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
