"use client"

import { useState, useRef } from "react"
import { validateRemoteImageUrl } from "@/lib/imageUrl"

type AccommodationData = {
  id: string
  name: string
  slug: string
  beachId: string
  description: string
  priceRange: string | null
  facebookUrl: string
  contactInfo: string | null
  checkInTime: string | null
  checkOutTime: string | null
  maxGuests: string | null
}

type BeachOption = { id: string; name: string }
type ImageData = { id: string; url: string; isLocal: boolean }

type Props = {
  accommodation: AccommodationData
  beaches: BeachOption[]
  initialImages: ImageData[]
  updateAccommodation: (formData: FormData) => Promise<void>
}

function RemotePreview({ url }: { url: string }) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const validation = validateRemoteImageUrl(url)
  if (!validation.ok) {
    return (
      <p className="text-xs text-red-600">
        {validation.error} — {url}
      </p>
    )
  }
  return (
    <div className="flex items-center gap-2 rounded border p-2">
      <img
        src={url}
        alt="Preview"
        className="h-12 w-16 rounded object-cover"
        onLoad={() => setStatus("ok")}
        onError={() => setStatus("error")}
      />
      <span className="flex-1 truncate text-xs">{url}</span>
      {status === "loading" && (
        <span className="text-muted-foreground text-xs">Loading image...</span>
      )}
      {status === "error" && (
        <span className="text-xs text-red-600">Unable to load image</span>
      )}
      {status === "ok" && <span className="text-xs text-green-600">✓</span>}
    </div>
  )
}

export function EditAccommodationForm({
  accommodation,
  beaches,
  initialImages,
  updateAccommodation,
}: Props) {
  const [images, setImages] = useState<ImageData[]>(initialImages)
  const [newRemoteInput, setNewRemoteInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const remoteEntries = newRemoteInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((rawUrl) => {
      try {
        const parsed = new URL(rawUrl)
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return false
        }
        return validateRemoteImageUrl(parsed.toString()).ok
      } catch {
        return false
      }
    })

  return (
    <form
      action={updateAccommodation}
      className="mt-4 grid gap-2 rounded-lg border p-4"
    >
      <input type="hidden" name="id" value={accommodation.id} />

      <div className="grid gap-2 sm:grid-cols-3">
        <input
          name="name"
          defaultValue={accommodation.name}
          required
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          name="slug"
          defaultValue={accommodation.slug}
          required
          pattern="[a-z0-9-]+"
          className="rounded border px-2 py-1 text-sm"
        />
        <select
          name="beachId"
          defaultValue={accommodation.beachId}
          required
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="">Select Beach *</option>
          {beaches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <textarea
        name="description"
        defaultValue={accommodation.description}
        required
        className="rounded border px-2 py-1 text-sm"
        rows={2}
      />

      <div className="grid gap-2 sm:grid-cols-4">
        <input
          name="priceRange"
          defaultValue={accommodation.priceRange ?? ""}
          placeholder="Price Range"
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          name="facebookUrl"
          defaultValue={accommodation.facebookUrl}
          required
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          name="contactInfo"
          defaultValue={accommodation.contactInfo ?? ""}
          placeholder="Contact Info"
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          name="maxGuests"
          defaultValue={accommodation.maxGuests ?? ""}
          placeholder="Max Guests"
          type="number"
          className="rounded border px-2 py-1 text-sm"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name="checkInTime"
          defaultValue={accommodation.checkInTime ?? ""}
          placeholder="Check-in"
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          name="checkOutTime"
          defaultValue={accommodation.checkOutTime ?? ""}
          placeholder="Check-out"
          className="rounded border px-2 py-1 text-sm"
        />
      </div>

      {/* --- Existing images gallery --- */}
      <div className="mt-4">
        <h3 className="mb-2 text-xs font-medium">Existing images</h3>
        {images.length === 0 ? (
          <p className="text-muted-foreground mb-2 text-xs">No images.</p>
        ) : null}
        {images.map((img) => (
          <div
            key={img.id}
            className="mb-2 flex items-center gap-2 rounded border p-2"
          >
            <img
              src={img.url}
              alt={img.isLocal ? "Local upload" : "Remote URL"}
              className="h-12 w-16 rounded object-cover"
            />
            {img.isLocal ? (
              <span className="text-muted-foreground text-xs">
                /uploads/...
              </span>
            ) : (
              <a
                href={img.url}
                target="_blank"
                rel="noopener"
                className="text-primary text-xs underline"
              >
                Open
              </a>
            )}
            <button
              type="button"
              onClick={() =>
                setImages((prev) => prev.filter((p) => p.id !== img.id))
              }
              className="hover:bg-muted ml-auto rounded border px-2 py-1 text-xs"
            >
              Remove
            </button>
            <input type="hidden" name="keptImageIds" value={img.id} />
          </div>
        ))}
      </div>

      {/* --- Add new images: remote URLs --- */}
      <div className="mt-3">
        <h3 className="mb-1 text-xs font-medium">
          Add remote URLs (comma separated)
        </h3>
        <input
          name="newRemoteUrls"
          value={newRemoteInput}
          onChange={(e) => setNewRemoteInput(e.target.value)}
          placeholder="https://example.com/img1.jpg , https://example.com/img2.jpg"
          className="w-full rounded border px-2 py-1 text-sm"
        />
        {remoteEntries.length > 0 && (
          <div className="mt-2 space-y-2">
            {remoteEntries.map((url, i) => (
              <RemotePreview key={`${url}-${i}`} url={url} />
            ))}
          </div>
        )}
      </div>

      {/* --- Add new images: local upload --- */}
      <div className="mt-3">
        <h3 className="mb-1 text-xs font-medium">Or upload new files</h3>
        <input
          ref={fileInputRef}
          name="newUploadedFiles"
          type="file"
          multiple
          accept="image/*,image/apng,image/svg+xml"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="hover:bg-muted rounded border px-3 py-2 text-xs transition-colors"
        >
          Browse Files
        </button>
        <p className="text-muted-foreground mt-1 text-xs">
          Allowed: JPEG, PNG, WebP. Max 5MB per file.
        </p>
      </div>

      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm"
      >
        Save Changes
      </button>
    </form>
  )
}
