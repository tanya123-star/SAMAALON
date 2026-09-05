import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
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
    async signIn({ user }) {
      // auto-create User on first sign-in, promote to ADMIN if email matches ADMIN_EMAIL
      // dynamic import to keep middleware (edge) from loading prisma/node:util/types
      const { prisma } = await import("@/lib/prisma")
      if (user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.email === process.env.ADMIN_EMAIL ? "ADMIN" : "USER",
            },
          })
        } else if (
          user.email === process.env.ADMIN_EMAIL &&
          existing.role !== "ADMIN"
        ) {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "ADMIN" },
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const { prisma } = await import("@/lib/prisma")
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.id = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) ?? (token.sub as string)
        ;(session.user as unknown as { role: string }).role =
          (token.role as string) ?? "USER"
      }
      return session
    },
  },
})
