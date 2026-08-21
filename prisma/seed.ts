import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding SAMAALON...");

  // Blog categories
  const beachCat = await prisma.blogCategory.upsert({
    where: { slug: "beach-guides" },
    update: {},
    create: { name: "Beach Guides", slug: "beach-guides" },
  });
  const travelCat = await prisma.blogCategory.upsert({
    where: { slug: "travel-tips" },
    update: {},
    create: { name: "Travel Tips", slug: "travel-tips" },
  });

  // Sample beaches
  const paradise = await prisma.beach.upsert({
    where: { slug: "paradise-beach" },
    update: {},
    create: {
      name: "Paradise Beach",
      slug: "paradise-beach",
      location: "Babak, Samal",
      description: "White sand beach with crystal clear water, perfect for family outings.",
      entranceFee: 50,
      latitude: 7.0907,
      longitude: 125.6957,
      googleMapsUrl: "https://maps.google.com/?q=7.0907,125.6957",
    },
  });

  const canibad = await prisma.beach.upsert({
    where: { slug: "canibad-beach" },
    update: {},
    create: {
      name: "Canibad Beach",
      slug: "canibad-beach",
      location: "Canibad, Samal",
      description: "Secluded beach known for its rock formations and snorkeling spots.",
      entranceFee: 30,
      latitude: 7.05,
      longitude: 125.73,
      googleMapsUrl: "https://maps.google.com/?q=7.05,125.73",
    },
  });

  // Sample accommodation
  await prisma.accommodation.upsert({
    where: { slug: "paradise-resort" },
    update: {},
    create: {
      beachId: paradise.id,
      name: "Paradise Resort",
      slug: "paradise-resort",
      description: "Beachfront resort with cottages and family rooms.",
      priceRange: "₱1,500 - ₱5,000",
      facebookUrl: "https://facebook.com/paradiseresort",
      maxGuests: 4,
    },
  });

  // Sample blog posts (Phase 2 seed requirement: 5 blogs per docs/07-roadmap.md:15)
  for (let i = 1; i <= 5; i++) {
    await prisma.blogPost.upsert({
      where: { slug: `samal-travel-guide-${i}` },
      update: {},
      create: {
        title: `Samal Travel Guide ${i}`,
        slug: `samal-travel-guide-${i}`,
        content: `Content for travel guide ${i} — discover Samal Island beaches and accommodations.`,
        categoryId: i % 2 === 0 ? travelCat.id : beachCat.id,
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log("Seed done: 2 beaches, 1 accommodation, 5 blogs");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
