export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 text-center">
      <h2 className="text-lg font-semibold">Beach not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">Check the URL or browse all beaches.</p>
      <a href="/beaches" className="mt-4 inline-block text-sm text-primary hover:underline">
        ← Back to Beaches
      </a>
    </div>
  );
}
