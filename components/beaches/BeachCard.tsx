import Link from "next/link"
import { SafeImage } from "@/components/ui/SafeImage"

type Beach = {
  id: string
  name: string
  slug: string
  location: string
  description: string
  entranceFee: unknown
  googleMapsUrl: string | null
  avgRating: unknown
  images?: { url: string; alt?: string | null }[]
}

export function BeachCard({ beach }: { beach: Beach }) {
  const imageUrl =
    beach.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#1C2A28]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Cover Image */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <SafeImage
          src={imageUrl}
          alt={beach.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#1C2A28] shadow-sm backdrop-blur-md">
          {beach.entranceFee
            ? `₱${String(beach.entranceFee)} Entrance`
            : "Free Access"}
        </div>
        {beach.avgRating ? (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-[#1C2A28]/80 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
            ⭐ {String(beach.avgRating)}
          </div>
        ) : null}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6">
        <span className="text-[11px] font-semibold tracking-wider text-[#2D6A4F] uppercase">
          {beach.location}
        </span>
        <h3 className="mt-1 font-serif text-xl font-bold text-[#1C2A28] transition-colors group-hover:text-[#2D6A4F]">
          <Link href={`/beaches/${beach.slug}`}>{beach.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#5A6B68]">
          {beach.description}
        </p>

        {/* Footer info & maps */}
        <div className="mt-6 flex items-center justify-between border-t border-[#1C2A28]/10 pt-4 text-xs">
          {beach.googleMapsUrl ? (
            <a
              href={beach.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-[#2D6A4F] hover:underline"
            >
              📍 Google Maps ↗
            </a>
          ) : (
            <span className="text-[#5A6B68]">Samal Island</span>
          )}
          <Link
            href={`/beaches/${beach.slug}`}
            className="font-bold text-[#1C2A28] hover:text-[#2D6A4F]"
          >
            Explore Cove →
          </Link>
        </div>
      </div>
    </div>
  )
}
