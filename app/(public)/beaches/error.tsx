"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h2 className="text-lg font-semibold">Failed to load beaches</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button onClick={() => reset()} className="mt-4 inline-flex h-8 items-center rounded-lg border px-3 text-sm">
        Retry
      </button>
    </div>
  );
}
