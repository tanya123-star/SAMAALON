import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const toggleSchema = z
  .object({
    beachId: z.string().cuid().optional(),
    accommodationId: z.string().cuid().optional(),
  })
  .refine((d) => !!d.beachId !== !!d.accommodationId, {
    message: "Provide beachId OR accommodationId",
  })

export async function GET() {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as unknown as { id: string }).id
  const [beaches, accommodations] = await Promise.all([
    prisma.favoriteBeach.findMany({
      where: { userId },
      include: { beach: true },
    }),
    prisma.favoriteAccommodation.findMany({
      where: { userId },
      include: { accommodation: true },
    }),
  ])
  return NextResponse.json({ beaches, accommodations })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as unknown as { id: string }).id
  if (!rateLimit(`fav:${userId}`, 20, 60_000))
    return NextResponse.json({ error: "Rate limited" }, { status: 429 })

  const body = await req.json()
  const parsed = toggleSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { beachId, accommodationId } = parsed.data
  if (beachId) {
    const existing = await prisma.favoriteBeach.findUnique({
      where: { userId_beachId: { userId, beachId } },
    })
    if (existing) {
      await prisma.favoriteBeach.delete({
        where: { userId_beachId: { userId, beachId } },
      })
      return NextResponse.json({ favorited: false })
    }
    await prisma.favoriteBeach.create({ data: { userId, beachId } })
    return NextResponse.json({ favorited: true })
  } else {
    const existing = await prisma.favoriteAccommodation.findUnique({
      where: {
        userId_accommodationId: { userId, accommodationId: accommodationId! },
      },
    })
    if (existing) {
      await prisma.favoriteAccommodation.delete({
        where: {
          userId_accommodationId: { userId, accommodationId: accommodationId! },
        },
      })
      return NextResponse.json({ favorited: false })
    }
    await prisma.favoriteAccommodation.create({
      data: { userId, accommodationId: accommodationId! },
    })
    return NextResponse.json({ favorited: true })
  }
}
