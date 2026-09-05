"use client"

import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { X } from "lucide-react"

type Props = {
  triggerClassName?: string
  buttonLabel?: string
}

export function LogoutConfirmDialog({
  triggerClassName,
  buttonLabel = "LOGOUT",
}: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  async function handleConfirm() {
    setLoading(true)
    await signOut({ callbackUrl: "/" })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          "text-xs font-semibold tracking-widest whitespace-nowrap text-[#5A6B68] uppercase transition-colors hover:text-[#1C2A28]"
        }
      >
        {buttonLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-[#1C2A28]/10 bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#5A6B68] transition-colors hover:bg-[#1C2A28]/5 hover:text-[#1C2A28] focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
            <h2
              id="logout-title"
              className="pr-8 font-serif text-lg font-bold text-[#1C2A28]"
            >
              Log out?
            </h2>
            <p className="mt-2 text-xs leading-relaxed tracking-wide break-words whitespace-normal text-[#5A6B68]">
              Are you sure you want to log out of your SAMAALON account?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border border-[#1C2A28]/15 bg-white px-4 py-2.5 text-xs font-bold tracking-widest text-[#1C2A28] uppercase transition-colors hover:bg-[#FAF8F5] focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 rounded-full bg-[#1C2A28] px-4 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-[#2D6A4F] focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:outline-none disabled:opacity-60"
              >
                {loading ? "Logging out…" : "Yes, Log Out"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
