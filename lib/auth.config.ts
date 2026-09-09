import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// Edge-safe Auth.js configuration.
// Must NOT import Prisma, pg, PrismaPg, fs, or other Node-only modules.
// Database-backed callbacks live in lib/auth.ts (server-only).
export default {
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) ?? (token.sub as string)
        ;(session.user as unknown as { role: string }).role =
          (token.role as string) ?? "USER"
      }
      return session
    },
  },
} satisfies NextAuthConfig
