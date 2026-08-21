export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4">
        <p>© {new Date().getFullYear()} SAMAALON — Samal Island discovery. Minimalist, no in-site reservations.</p>
        <p className="mt-1 text-xs">Beach data via admin; booking via Facebook. Maps via Google Maps links.</p>
      </div>
    </footer>
  );
}
