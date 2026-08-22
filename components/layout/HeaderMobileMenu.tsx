"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type Props = {
  isAuthed: boolean;
  userName?: string;
  role?: string;
};

const links = [
  { href: "/", label: "HOME" },
  { href: "/beaches", label: "BEACHES" },
  { href: "/blog", label: "BLOG" },
  { href: "/about", label: "ABOUT SAMAL" },
];

export function HeaderMobileMenu({ isAuthed, userName, role }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent hover:bg-[#1C2A28]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]"
      >
        {open ? <X className="h-5 w-5 text-[#1C2A28]" /> : <Menu className="h-5 w-5 text-[#1C2A28]" />}
      </button>
      {open ? (
        <>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40"
          />
          <nav className="fixed top-16 left-0 right-0 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden border-t border-[#1C2A28]/10 bg-[#FAF8F5] px-4 py-4 shadow-md">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-widest text-[#5A6B68] hover:bg-[#1C2A28]/5 hover:text-[#1C2A28]"
                >
                  {l.label}
                </Link>
              ))}
              {isAuthed ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-widest text-[#1C2A28] hover:bg-[#1C2A28]/5"
                  >
                    PROFILE {userName ? `(${userName})` : ""}
                  </Link>
                  {role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="mx-3 mt-1 inline-flex w-fit rounded-full bg-[#1C2A28] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
                    >
                      ADMIN
                    </Link>
                  ) : null}
                  <form
                    action={async () => {
                      const res = await fetch("/api/auth/signout", { method: "POST" });
                      if (res.ok) window.location.href = "/";
                    }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetch("/api/auth/signout", { method: "POST" }).then(() => {
                        setOpen(false);
                        window.location.href = "/";
                      });
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full rounded-md px-3 py-3 text-left text-sm font-semibold uppercase tracking-widest text-[#5A6B68] hover:bg-[#1C2A28]/5 hover:text-[#1C2A28]"
                    >
                      LOGOUT
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/api/auth/signin"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex w-full justify-center rounded-full bg-[#1C2A28] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#2D6A4F]"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </nav>
        </>
      ) : null}
    </div>
  );
}
