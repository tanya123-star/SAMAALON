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

  // Delete old generic slugs (approved: keep only 5 topics)
  await prisma.blogPost.deleteMany({
    where: { slug: { in: ["samal-travel-guide-1", "samal-travel-guide-2", "samal-travel-guide-3", "samal-travel-guide-4", "samal-travel-guide-5"] } },
  });

  // Approved Samaalon blog topics
  const blogTopics = [
    {
      title: "10 Best Beaches in Samal",
      slug: "10-best-beaches-in-samal",
      content:
        "Discover the 10 best beaches in Samal Island — from Paradise Beach to Canibad, with entrance fees, amenities, and maps.",
    },
    {
      title: "Things to Do in Samal Island",
      slug: "things-to-do-in-samal-island",
      content:
        "Top things to do in Samal: snorkeling, island hopping, hiking, and local food — with beach and accommodation links.",
    },
    {
      title: "How to Get to Samal Island",
      slug: "how-to-get-to-samal-island",
      content:
        "How to get to Samal Island from Davao City — ferry schedules, routes, and travel tips for first-time visitors.",
    },
    {
      title: "Best Accommodations in Samal",
      slug: "best-accommodations-in-samal",
      content:
        "Best accommodations in Samal by beach — price ranges, room types, amenities, and Facebook booking links.",
    },
    {
      title: "Samal Island Travel Guide",
      slug: "samal-island-travel-guide",
      content:
        "Complete Samal Island travel guide — beaches, stays, maps, and tips for planning your trip.",
    },
  ];

  for (const topic of blogTopics) {
    await prisma.blogPost.upsert({
      where: { slug: topic.slug },
      update: { title: topic.title, content: topic.content },
      create: {
        title: topic.title,
        slug: topic.slug,
        content: topic.content,
        categoryId: topic.slug.includes("beach") ? beachCat.id : travelCat.id,
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log("Seed done: 2 beaches, 1 accommodation, 5 blogs (approved topics)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
