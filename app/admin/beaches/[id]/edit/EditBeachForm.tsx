"use client";

import { useState, useRef } from "react";
import { validateRemoteImageUrl } from "@/lib/imageUrl";

type BeachData = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  entranceFee: string | null;
  openingHours: string | null;
  contactInfo: string | null;
  googleMapsUrl: string | null;
  latitude: string | null;
  longitude: string | null;
};

type ImageData = { id: string; url: string; isLocal: boolean };

type Props = {
  beach: BeachData;
  initialImages: ImageData[];
  updateBeach: (formData: FormData) => Promise<void>;
};

function RemotePreview({ url }: { url: string }) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const validation = validateRemoteImageUrl(url);
  if (!validation.ok) {
    return <p className="text-xs text-red-600">{validation.error} — {url}</p>;
  }
  return (
    <div className="flex items-center gap-2 rounded border p-2">
      <img
        src={url}
        alt="Preview"
        className="w-16 h-12 object-cover rounded"
        onLoad={() => setStatus("ok")}
        onError={() => setStatus("error")}
      />
      <span className="text-xs flex-1 truncate">{url}</span>
      {status === "loading" && <span className="text-xs text-muted-foreground">Loading image...</span>}
      {status === "error" && <span className="text-xs text-red-600">Unable to load image</span>}
      {status === "ok" && <span className="text-xs text-green-600">✓</span>}
    </div>
  );
}

export function EditBeachForm({ beach, initialImages, updateBeach }: Props) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [newRemoteInput, setNewRemoteInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remoteEntries = newRemoteInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <form action={updateBeach} className="mt-4 grid gap-2 rounded-lg border p-4">
      <input type="hidden" name="id" value={beach.id} />

      <div className="grid gap-2 sm:grid-cols-3">
        <input name="name" defaultValue={beach.name} required className="rounded border px-2 py-1 text-sm" />
        <input name="slug" defaultValue={beach.slug} required pattern="[a-z0-9-]+" className="rounded border px-2 py-1 text-sm" />
        <input name="location" defaultValue={beach.location} required className="rounded border px-2 py-1 text-sm" />
      </div>
      <textarea name="description" defaultValue={beach.description} required className="rounded border px-2 py-1 text-sm" rows={2} />

      <div className="grid gap-2 sm:grid-cols-4">
        <input name="entranceFee" defaultValue={beach.entranceFee ?? ""} placeholder="Entrance Fee" type="number" step="0.01" className="rounded border px-2 py-1 text-sm" />
        <input name="openingHours" defaultValue={beach.openingHours ?? ""} placeholder="Opening Hours" className="rounded border px-2 py-1 text-sm" />
        <input name="contactInfo" defaultValue={beach.contactInfo ?? ""} placeholder="Contact Info" className="rounded border px-2 py-1 text-sm" />
        <input name="googleMapsUrl" defaultValue={beach.googleMapsUrl ?? ""} placeholder="Google Maps URL" className="rounded border px-2 py-1 text-sm" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input name="latitude" defaultValue={beach.latitude ?? ""} placeholder="Latitude" type="number" step="any" className="rounded border px-2 py-1 text-sm" />
        <input name="longitude" defaultValue={beach.longitude ?? ""} placeholder="Longitude" type="number" step="any" className="rounded border px-2 py-1 text-sm" />
      </div>

      {/* --- Existing images gallery --- */}
      <div className="mt-4">
        <h3 className="text-xs font-medium mb-2">Existing images</h3>
        {images.length === 0 ? <p className="text-xs text-muted-foreground mb-2">No images.</p> : null}
        {images.map((img) => (
          <div key={img.id} className="flex items-center gap-2 rounded border p-2 mb-2">
            <img src={img.url} alt={img.isLocal ? "Local upload" : "Remote URL"} className="w-16 h-12 object-cover rounded" />
            {img.isLocal ? <span className="text-xs text-muted-foreground">/uploads/...</span> : <a href={img.url} target="_blank" rel="noopener" className="text-xs text-primary underline">Open</a>}
            <button type="button" onClick={() => setImages((prev) => prev.filter((p) => p.id !== img.id))} className="ml-auto rounded border px-2 py-1 text-xs hover:bg-muted">Remove</button>
            <input type="hidden" name="keptImageIds" value={img.id} />
          </div>
        ))}
      </div>

      {/* --- Add new images: remote URLs --- */}
      <div className="mt-3">
        <h3 className="text-xs font-medium mb-1">Add remote URLs (comma separated)</h3>
        <input
          name="newRemoteUrls"
          value={newRemoteInput}
          onChange={(e) => setNewRemoteInput(e.target.value)}
          placeholder="https://example.com/img1.jpg , https://example.com/img2.jpg"
          className="rounded border px-2 py-1 text-sm w-full"
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
        <h3 className="text-xs font-medium mb-1">Or upload new files</h3>
        <input ref={fileInputRef} name="newUploadedFiles" type="file" multiple accept="image/*,image/apng,image/svg+xml" className="hidden" />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded border px-3 py-2 text-xs hover:bg-muted transition-colors">Browse Files</button>
        <p className="text-xs text-muted-foreground mt-1">Allowed: JPEG, PNG, WebP. Max 5MB per file.</p>
      </div>

      <button type="submit" className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground">Save Changes</button>
    </form>
  );
}
