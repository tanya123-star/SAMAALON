import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"
import { roomTypeSchema } from "@/lib/validations/roomType"
import { EditRoomTypeForm } from "./EditRoomTypeForm"

async function updateRoomType(formData: FormData) {
  "use server"
  const accommodationId = String(formData.get("accommodationId") ?? "")
  const roomTypeId = String(formData.get("roomTypeId") ?? "")
  const raw = {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    price: String(formData.get("price") ?? ""),
    maxGuests: String(formData.get("maxGuests") ?? "") || undefined,
    amenities: String(formData.get("amenities") ?? "") || undefined,
    imageUrl: String(formData.get("imageUrl") ?? "") || undefined,
    accommodationId,
  }
  const parsed = roomTypeSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)
  const d = parsed.data
  try {
    await prisma.roomType.update({
      where: { id: roomTypeId },
      data: {
        name: d.name,
        description: d.description ?? (null as never),
        price: d.price,
        maxGuests: d.maxGuests ?? (null as never),
        amenities: d.amenities ?? (null as never),
        imageUrl: d.imageUrl || (null as never),
      } as never,
    })
  } catch (e: unknown) {
    throw e
  }
  revalidatePath(`/admin/accommodations/${accommodationId}/room-types`)
  revalidatePath("/accommodations")
  revalidatePath("/")
  redirect(`/admin/accommodations/${accommodationId}/room-types`)
}

export default async function EditRoomTypePage({
  params,
}: {
  params: Promise<{ id: string; roomTypeId: string }>
}) {
  const { id: accommodationId, roomTypeId } = await params
  const [roomType, acc] = await Promise.all([
    prisma.roomType.findUnique({ where: { id: roomTypeId } }),
    prisma.accommodation.findUnique({
      where: { id: accommodationId },
      include: { beach: true },
    }),
  ])
  if (!roomType || !acc) notFound()
  if (roomType.accommodationId !== accommodationId) notFound()

  const roomTypeData = {
    id: roomType.id,
    name: roomType.name,
    description: roomType.description ?? null,
    price: String(roomType.price),
    maxGuests: roomType.maxGuests != null ? String(roomType.maxGuests) : null,
    amenities: roomType.amenities ?? null,
    imageUrl: roomType.imageUrl ?? null,
  }

  return (
    <div>
      <Link
        href={`/admin/accommodations/${accommodationId}/room-types`}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        ← Back to Room Types
      </Link>
      <h1 className="mt-2 text-xl font-bold">
        Edit Room Type: {roomType.name} — {acc.name}
      </h1>
      <EditRoomTypeForm
        roomType={roomTypeData}
        updateRoomType={updateRoomType}
      />
    </div>
  )
}
