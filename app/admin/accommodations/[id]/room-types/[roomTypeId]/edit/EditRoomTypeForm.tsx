"use client"

import { useState } from "react"
import { validateRemoteImageUrl } from "@/lib/imageUrl"

type RoomTypeData = {
  id: string
  name: string
  description: string | null
  price: string
  maxGuests: string | null
  amenities: string | null
  imageUrl: string | null
}

type Props = {
  roomType: RoomTypeData
  updateRoomType: (formData: FormData) => Promise<void>
}

function ImagePreview({ url }: { url: string }) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const isLocal = url.startsWith("/uploads/")
  const validation = isLocal
    ? { ok: true as const, url }
    : validateRemoteImageUrl(url)
  if (!validation.ok) {
    return <p className="text-xs text-red-600">{validation.error}</p>
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

export function EditRoomTypeForm({ roomType, updateRoomType }: Props) {
  const [imageUrlInput, setImageUrlInput] = useState(roomType.imageUrl ?? "")

  const trimmedUrl = imageUrlInput.trim()
  const showPreview = trimmedUrl.length > 0

  return (
    <form
      action={updateRoomType}
      className="mt-4 grid gap-2 rounded-lg border p-4"
    >
      <input type="hidden" name="roomTypeId" value={roomType.id} />

      <input
        name="name"
        defaultValue={roomType.name}
        required
        placeholder="Name (e.g. Deluxe)"
        className="rounded border px-2 py-1 text-sm"
      />
      <textarea
        name="description"
        defaultValue={roomType.description ?? ""}
        placeholder="Description"
        className="rounded border px-2 py-1 text-sm"
        rows={2}
      />

      <div className="grid gap-2 sm:grid-cols-3">
        <input
          name="price"
          defaultValue={roomType.price}
          required
          placeholder="Price (e.g. 3200)"
          type="number"
          step="0.01"
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          name="maxGuests"
          defaultValue={roomType.maxGuests ?? ""}
          placeholder="Max Guests"
          type="number"
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          name="amenities"
          defaultValue={roomType.amenities ?? ""}
          placeholder="Amenities (comma separated)"
          className="rounded border px-2 py-1 text-sm"
        />
      </div>

      <div className="mt-2">
        <h3 className="mb-1 text-xs font-medium">
          Image URL (remote https://... or local /uploads/...)
        </h3>
        <input
          name="imageUrl"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          placeholder="https://example.com/room.jpg or /uploads/room.jpg"
          className="w-full rounded border px-2 py-1 text-sm"
          autoComplete="off"
        />
        {showPreview ? (
          <div className="mt-2">
            <ImagePreview url={trimmedUrl} />
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        className="bg-primary text-primary-foreground mt-2 rounded px-3 py-2 text-sm"
      >
        Save Changes
      </button>
    </form>
  )
}
