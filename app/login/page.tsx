import Link from "next/link";
import { LoginForm } from "./LoginForm";

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams;
  const safeCallbackUrl = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="font-serif text-2xl font-bold tracking-[0.25em] text-[#1C2A28]">
            SAMAALON
          </Link>
        </div>
        <div className="bg-[#1C2A28] rounded-2xl shadow-xl border border-white/10 p-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-white">Welcome to Samaalon</h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Sign in to explore Samal Island, save your favorite places, leave reviews, and continue to booking.
          </p>

          {error ? (
            <div className="mt-5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-300">
              Authentication failed. Please try again.
            </div>
          ) : null}

          <div className="mt-6">
            <LoginForm callbackUrl={safeCallbackUrl} />
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/60">Don&apos;t have a Google account?</p>
            <a
              href="https://accounts.google.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs font-semibold text-white underline underline-offset-4 hover:text-white/80"
            >
              Create a Google Account
            </a>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-[#5A6B68]">Google handles authentication securely. No passwords stored on Samaalon.</p>
      </div>
    </div>
  );
}
