export function validateRemoteImageUrl(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  const s = raw.trim();
  if (!s) return { ok: false, error: "Empty URL" };
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return { ok: false, error: "Please enter a direct image URL starting with https://" };
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { ok: false, error: "Please enter a direct image URL starting with https://" };
  }
  // Block known HTML page URLs, not image resources
  const host = u.hostname.toLowerCase();
  const path = u.pathname.toLowerCase();
  if ((host === "unsplash.com" || host.endsWith(".unsplash.com")) && path.startsWith("/photos/")) {
    return { ok: false, error: "Please use the direct image URL (images.unsplash.com/photo-...) not the Unsplash page URL" };
  }
  // Reject markdown / HTML injection
  if (s.includes("[") || s.includes("]") || s.includes("<") || s.includes(">")) {
    return { ok: false, error: "Please enter a direct image URL starting with https://" };
  }
  return { ok: true, url: s };
}
