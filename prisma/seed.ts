import "dotenv/config";
import { PrismaClient, ModerationStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding SAMAALON with full Samal Island research content...");

  // 1. Seed Amenities
  const amenityData = [
    { name: "Swimming Area", icon: "Waves" },
    { name: "White Sand Shoreline", icon: "Sun" },
    { name: "Cottages & Huts", icon: "Home" },
    { name: "Restrooms & Showers", icon: "Bath" },
    { name: "Parking Area", icon: "Car" },
    { name: "Restaurant / Canteen", icon: "Utensils" },
    { name: "Wi-Fi", icon: "Wifi" },
    { name: "Water Sports & Jet Ski", icon: "Anchor" },
    { name: "Snorkeling Reefs", icon: "Fish" },
    { name: "Infinity Pool", icon: "Sparkles" },
    { name: "Air Conditioning", icon: "Wind" },
    { name: "Cliff Jumping", icon: "Zap" },
  ];

  const amenitiesMap = new Map<string, string>();
  for (const item of amenityData) {
    const amenity = await prisma.amenity.upsert({
      where: { name: item.name },
      update: { icon: item.icon },
      create: { name: item.name, icon: item.icon },
    });
    amenitiesMap.set(item.name, amenity.id);
  }

  // 2. Blog categories
  const categories = [
    { name: "Travel Guides", slug: "travel-guides" },
    { name: "Beaches", slug: "beaches" },
    { name: "Accommodations", slug: "accommodations" },
    { name: "Things to Do", slug: "things-to-do" },
    { name: "How to Get There", slug: "how-to-get-there" },
    { name: "Travel Tips", slug: "travel-tips" },
    { name: "Samal Island", slug: "samal-island" },
  ];

  const catMap = new Map<string, string>();
  for (const cat of categories) {
    const res = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    catMap.set(cat.slug, res.id);
  }

  // 3. Top 10 Beaches Data
  const beachesData = [
    {
      name: "Paradise Island Park & Beach Resort",
      slug: "paradise-island-park-beach-resort",
      location: "Babak District, Samal Island",
      description:
        "Samal's premier accessible paradise featuring manicured white sand shorelines, serene gardens, an aviary, and family-friendly dining. Just a 10-minute boat ride from Davao Sasa Wharf.",
      entranceFee: 250,
      openingHours: "6:00 AM - 5:00 PM",
      contactInfo: "+63 82 233 0251 | info@paradiseisland.ph",
      latitude: 7.0907,
      longitude: 125.6957,
      googleMapsUrl: "https://maps.google.com/?q=7.0907,125.6957",
      avgRating: 4.8,
      reviewCount: 142,
      amenities: ["Swimming Area", "White Sand Shoreline", "Cottages & Huts", "Restrooms & Showers", "Parking Area", "Restaurant / Canteen", "Wi-Fi"],
      images: [
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", alt: "Paradise Island Shoreline" },
        { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", alt: "Paradise Island Gardens" }
      ],
      accommodations: [
        {
          name: "Paradise Island Premier Resort Rooms",
          slug: "paradise-island-premier-resort",
          description: "Air-conditioned beachfront villas and family rooms nestled inside lush tropical gardens.",
          priceRange: "₱2,500 - ₱6,500 / night",
          facebookUrl: "https://facebook.com/paradiseislandsamal",
          contactInfo: "+63 82 233 0251",
          checkInTime: "2:00 PM",
          checkOutTime: "12:00 PM",
          maxGuests: 6,
          avgRating: 4.8,
          reviewCount: 89,
          amenities: ["Air Conditioning", "Wi-Fi", "Restaurant / Canteen", "White Sand Shoreline"],
          roomTypes: [
            { name: "Deluxe Garden Villa", price: 3200, maxGuests: 2, description: "Queen bed, garden balcony, AC, private bath.", amenities: "Aircon, Wi-Fi, Hot Shower, Mini Fridge" },
            { name: "Family Beachfront Suite", price: 5800, maxGuests: 6, description: "Two queen beds, beachfront terrace, spacious lounge.", amenities: "Aircon, Wi-Fi, Ocean View, Cable TV" }
          ]
        }
      ]
    },
    {
      name: "Kaputian Beach Park",
      slug: "kaputian-beach-park",
      location: "Kaputian District, Southern Samal",
      description:
        "Famous municipal public beach located at the southern tip of Samal Island. Known for turquoise waters, coconut palms, and views of Talikud Island.",
      entranceFee: 50,
      openingHours: "24 Hours (Public Park)",
      contactInfo: "+63 917 000 1122",
      latitude: 6.9689,
      longitude: 125.7142,
      googleMapsUrl: "https://maps.google.com/?q=6.9689,125.7142",
      avgRating: 4.5,
      reviewCount: 98,
      amenities: ["Swimming Area", "Cottages & Huts", "Restrooms & Showers", "Parking Area"],
      images: [
        { url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", alt: "Kaputian Beach Palm Trees" }
      ],
      accommodations: [
        {
          name: "Kaputian Beachfront Huts",
          slug: "kaputian-beachfront-huts",
          description: "Rustic open-air and closed wooden huts located right on the public beach.",
          priceRange: "₱800 - ₱2,000 / night",
          facebookUrl: "https://facebook.com/kaputianbeachpark",
          contactInfo: "+63 917 000 1122",
          checkInTime: "1:00 PM",
          checkOutTime: "11:00 AM",
          maxGuests: 4,
          avgRating: 4.4,
          reviewCount: 35,
          amenities: ["Cottages & Huts", "White Sand Shoreline"],
          roomTypes: [
            { name: "Standard Open Hut", price: 800, maxGuests: 4, description: "Bamboo open cottage with mat and electric fan.", amenities: "Electric Fan, Ocean View" }
          ]
        }
      ]
    },
    {
      name: "Canibad Cove",
      slug: "canibad-cove",
      location: "Aundanao, Babak District",
      description:
        "Hidden cove nestled beneath dramatic limestone cliffs on Samal's eastern coast. Features pebble-and-white-sand shores, deep turquoise waters for cliff jumping, and serene rustic vibes.",
      entranceFee: 100,
      openingHours: "6:00 AM - 6:00 PM",
      contactInfo: "+63 920 123 4567",
      latitude: 7.0512,
      longitude: 125.7311,
      googleMapsUrl: "https://maps.google.com/?q=7.0512,125.7311",
      avgRating: 4.7,
      reviewCount: 110,
      amenities: ["Cliff Jumping", "Snorkeling Reefs", "Cottages & Huts", "Restrooms & Showers"],
      images: [
        { url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80", alt: "Canibad Cliff Cove" }
      ],
      accommodations: [
        {
          name: "Canibad Secret Cove Resort",
          slug: "canibad-secret-cove-resort",
          description: "Eco-friendly cliffside huts overlooking the turquoise Canibad cove.",
          priceRange: "₱1,200 - ₱3,500 / night",
          facebookUrl: "https://facebook.com/canibadsecretcove",
          contactInfo: "+63 920 123 4567",
          checkInTime: "2:00 PM",
          checkOutTime: "12:00 PM",
          maxGuests: 5,
          avgRating: 4.6,
          reviewCount: 42,
          amenities: ["Cliff Jumping", "Cottages & Huts", "Restaurant / Canteen"],
          roomTypes: [
            { name: "Cliffside Bamboo Villa", price: 2200, maxGuests: 3, description: "Elevated bamboo cabin with balcony overlooking the cove.", amenities: "Fan, Sea View Balcony, Private Toilet" }
          ]
        }
      ]
    },
    {
      name: "Isla Reta Beach Resort",
      slug: "isla-reta-beach-resort",
      location: "Talikud Island, Kaputian",
      description:
        "Famous back-to-basics island destination on Talikud Island. Iconic powder-soft white sand shaded by sprawling green Talisay tree canopy, featuring rich coral reefs for snorkeling.",
      entranceFee: 150,
      openingHours: "24 Hours",
      contactInfo: "+63 928 555 7890",
      latitude: 6.9421,
      longitude: 125.6845,
      googleMapsUrl: "https://maps.google.com/?q=6.9421,125.6845",
      avgRating: 4.9,
      reviewCount: 210,
      amenities: ["White Sand Shoreline", "Snorkeling Reefs", "Cottages & Huts", "Restaurant / Canteen", "Restrooms & Showers"],
      images: [
        { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80", alt: "Isla Reta Talisay Shore" }
      ],
      accommodations: [
        {
          name: "Isla Reta Beachfront Pavilions",
          slug: "isla-reta-beachfront-pavilions",
          description: "Rustic wooden rooms and beach pavilions under the Talisay trees.",
          priceRange: "₱1,000 - ₱3,000 / night",
          facebookUrl: "https://facebook.com/islaretabeachresort",
          contactInfo: "+63 928 555 7890",
          checkInTime: "1:00 PM",
          checkOutTime: "11:00 AM",
          maxGuests: 4,
          avgRating: 4.8,
          reviewCount: 95,
          amenities: ["White Sand Shoreline", "Cottages & Huts"],
          roomTypes: [
            { name: "Talisay Wooden Room", price: 1500, maxGuests: 2, description: "Basic wooden room right on the sand.", amenities: "Fan, Common Bath, Beach Access" }
          ]
        }
      ]
    },
    {
      name: "SECDEA Beach Resort",
      slug: "secdea-beach-resort",
      location: "San Jose, Kaputian",
      description:
        "Upscale resort offering modern amenities, a sea-facing infinity pool, long wooden boardwalk over mangrove waters, and water sports activities.",
      entranceFee: 800,
      openingHours: "7:00 AM - 5:00 PM",
      contactInfo: "+63 82 295 2912 | info@secdeabeachresort.com",
      latitude: 6.9854,
      longitude: 125.7289,
      googleMapsUrl: "https://maps.google.com/?q=6.9854,125.7289",
      avgRating: 4.7,
      reviewCount: 160,
      amenities: ["Infinity Pool", "Water Sports & Jet Ski", "Restaurant / Canteen", "Wi-Fi", "Parking Area"],
      images: [
        { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80", alt: "SECDEA Infinity Pool" }
      ],
      accommodations: [
        {
          name: "SECDEA Deluxe Villas",
          slug: "secdea-deluxe-villas",
          description: "Luxury poolside and seaside villas equipped with modern hotel amenities.",
          priceRange: "₱4,500 - ₱12,000 / night",
          facebookUrl: "https://facebook.com/secdeabeachresort",
          contactInfo: "+63 82 295 2912",
          checkInTime: "2:00 PM",
          checkOutTime: "12:00 PM",
          maxGuests: 8,
          avgRating: 4.7,
          reviewCount: 78,
          amenities: ["Infinity Pool", "Air Conditioning", "Wi-Fi", "Restaurant / Canteen"],
          roomTypes: [
            { name: "Seaside Villa", price: 6500, maxGuests: 4, description: "Luxury villa with glass balcony overlooking the gulf.", amenities: "Aircon, Wi-Fi, Cable TV, Breakfast Included" }
          ]
        }
      ]
    },
    {
      name: "Pearl Farm Beach Resort",
      slug: "pearl-farm-beach-resort",
      location: "Adecor, Kaputian",
      description:
        "Samal's flagship 5-star luxury eco-resort built on a former pearl farm. Features iconic overwater stilt cottages designed by Francisco Mañosa, private white sand coves, and exclusive access to Malipano Island.",
      entranceFee: 1500,
      openingHours: "7:00 AM - 6:00 PM (Package Booking)",
      contactInfo: "+63 82 285 0601 | customercare@pearlfarmresort.com",
      latitude: 6.9934,
      longitude: 125.7056,
      googleMapsUrl: "https://maps.google.com/?q=6.9934,125.7056",
      avgRating: 4.9,
      reviewCount: 320,
      amenities: ["Infinity Pool", "White Sand Shoreline", "Restaurant / Canteen", "Wi-Fi", "Water Sports & Jet Ski", "Snorkeling Reefs"],
      images: [
        { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", alt: "Pearl Farm Overwater Cottages" }
      ],
      accommodations: [
        {
          name: "Pearl Farm Samal Suites & Water Cottages",
          slug: "pearl-farm-samal-suites",
          description: "World-class 5-star overwater cottages and Malipano luxury villas.",
          priceRange: "₱12,000 - ₱35,000 / night",
          facebookUrl: "https://facebook.com/pearlfarmbnresort",
          contactInfo: "+63 82 285 0601",
          checkInTime: "3:00 PM",
          checkOutTime: "12:00 PM",
          maxGuests: 6,
          avgRating: 4.9,
          reviewCount: 180,
          amenities: ["Infinity Pool", "Air Conditioning", "Wi-Fi", "Restaurant / Canteen", "Water Sports & Jet Ski"],
          roomTypes: [
            { name: "Mandaya Water Cottage", price: 16500, maxGuests: 2, description: "Stilt cottage perched over clear turquoise ocean waters.", amenities: "King Bed, Balcony Sea Access, Luxury Spa Bath, Aircon" }
          ]
        }
      ]
    },
    {
      name: "Cavanico iL Mare Resort",
      slug: "cavanico-il-mare-resort",
      location: "Camudmud, Babak District",
      description:
        "Vibrant beach resort offering an expansive sandy beach, jet-ski rentals, beach volleyball, clean modern shower facilities, and night beach lighting.",
      entranceFee: 350,
      openingHours: "7:00 AM - 6:00 PM",
      contactInfo: "+63 917 888 9900",
      latitude: 7.1205,
      longitude: 125.6812,
      googleMapsUrl: "https://maps.google.com/?q=7.1205,125.6812",
      avgRating: 4.6,
      reviewCount: 88,
      amenities: ["White Sand Shoreline", "Water Sports & Jet Ski", "Restaurant / Canteen", "Parking Area", "Restrooms & Showers"],
      images: [
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", alt: "Cavanico Beachfront" }
      ],
      accommodations: [
        {
          name: "Cavanico Beachfront Rooms",
          slug: "cavanico-beachfront-rooms",
          description: "Modern beach cabins steps away from the water sports area.",
          priceRange: "₱2,200 - ₱5,500 / night",
          facebookUrl: "https://facebook.com/cavanicoilmare",
          contactInfo: "+63 917 888 9900",
          checkInTime: "2:00 PM",
          checkOutTime: "12:00 PM",
          maxGuests: 4,
          avgRating: 4.5,
          reviewCount: 40,
          amenities: ["Air Conditioning", "Wi-Fi", "Water Sports & Jet Ski"],
          roomTypes: [
            { name: "Beachfront Cabin", price: 3500, maxGuests: 4, description: "Modern cabin with veranda.", amenities: "Aircon, TV, Private Bathroom" }
          ]
        }
      ]
    },
    {
      name: "Costa Marina Beach Resort",
      slug: "costa-marina-beach-resort",
      location: "Babak District, Samal Island",
      description:
        "Quiet, lush sanctuary adjacent to Paradise Island. Features peaceful coconut groves, clear calm waters, and secluded day-lounging spots.",
      entranceFee: 250,
      openingHours: "6:00 AM - 5:00 PM",
      contactInfo: "+63 82 233 1209",
      latitude: 7.0892,
      longitude: 125.6948,
      googleMapsUrl: "https://maps.google.com/?q=7.0892,125.6948",
      avgRating: 4.7,
      reviewCount: 75,
      amenities: ["White Sand Shoreline", "Cottages & Huts", "Restaurant / Canteen", "Restrooms & Showers"],
      images: [
        { url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", alt: "Costa Marina Garden Shoreline" }
      ],
      accommodations: [
        {
          name: "Costa Marina Garden Cabanas",
          slug: "costa-marina-garden-cabanas",
          description: "Tranquil wooden cabanas nestled under coconut palms.",
          priceRange: "₱1,800 - ₱4,000 / night",
          facebookUrl: "https://facebook.com/costamarinasamal",
          contactInfo: "+63 82 233 1209",
          checkInTime: "2:00 PM",
          checkOutTime: "12:00 PM",
          maxGuests: 4,
          avgRating: 4.6,
          reviewCount: 32,
          amenities: ["Air Conditioning", "Cottages & Huts"],
          roomTypes: [
            { name: "Garden Cabana", price: 2500, maxGuests: 2, description: "Cozy wooden cabana surrounded by gardens.", amenities: "Aircon, Veranda" }
          ]
        }
      ]
    },
    {
      name: "Vanishing Island & Coral Garden",
      slug: "vanishing-island-coral-garden",
      location: "Tambo, Babak District",
      description:
        "A mangrove-dotted tidal sandbar off Samal that emerges during low tide. Offers shallow crystal-clear waters perfect for wading and observing marine sea life.",
      entranceFee: 100,
      openingHours: "6:00 AM - 12:00 PM (Low Tide)",
      contactInfo: "+63 915 777 4433",
      latitude: 7.1054,
      longitude: 125.6721,
      googleMapsUrl: "https://maps.google.com/?q=7.1054,125.6721",
      avgRating: 4.6,
      reviewCount: 94,
      amenities: ["Snorkeling Reefs", "Cottages & Huts", "Swimming Area"],
      images: [
        { url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80", alt: "Vanishing Island Sandbar" }
      ],
      accommodations: []
    },
    {
      name: "Maxima Aqua Fun",
      slug: "maxima-aqua-fun",
      location: "Peñaplata District, Samal Island",
      description:
        "Thrill-seeker adventure resort featuring a 40-foot giant water slide dumping directly into the ocean, kayaking, canopy walking, and diving spots.",
      entranceFee: 400,
      openingHours: "8:00 AM - 5:00 PM",
      contactInfo: "+63 922 847 4700",
      latitude: 7.0289,
      longitude: 125.7112,
      googleMapsUrl: "https://maps.google.com/?q=7.0289,125.7112",
      avgRating: 4.5,
      reviewCount: 105,
      amenities: ["Water Sports & Jet Ski", "Snorkeling Reefs", "Restaurant / Canteen", "Cottages & Huts"],
      images: [
        { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80", alt: "Maxima Ocean Slide" }
      ],
      accommodations: [
        {
          name: "Maxima Aqua Cabins",
          slug: "maxima-aqua-cabins",
          description: "Cliffside wooden cabins for overnight adventure seekers.",
          priceRange: "₱1,800 - ₱4,500 / night",
          facebookUrl: "https://facebook.com/maximaaquafun",
          contactInfo: "+63 922 847 4700",
          checkInTime: "2:00 PM",
          checkOutTime: "12:00 PM",
          maxGuests: 6,
          avgRating: 4.4,
          reviewCount: 48,
          amenities: ["Cottages & Huts", "Restaurant / Canteen"],
          roomTypes: [
            { name: "Cliffside Room", price: 2400, maxGuests: 4, description: "Wooden room perched above the diving deck.", amenities: "Fan, Ocean View" }
          ]
        }
      ]
    }
  ];

  for (const b of beachesData) {
    const beach = await prisma.beach.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        location: b.location,
        description: b.description,
        entranceFee: b.entranceFee,
        openingHours: b.openingHours,
        contactInfo: b.contactInfo,
        latitude: b.latitude,
        longitude: b.longitude,
        googleMapsUrl: b.googleMapsUrl,
        avgRating: b.avgRating,
        reviewCount: b.reviewCount,
      },
      create: {
        name: b.name,
        slug: b.slug,
        location: b.location,
        description: b.description,
        entranceFee: b.entranceFee,
        openingHours: b.openingHours,
        contactInfo: b.contactInfo,
        latitude: b.latitude,
        longitude: b.longitude,
        googleMapsUrl: b.googleMapsUrl,
        avgRating: b.avgRating,
        reviewCount: b.reviewCount,
      },
    });

    // Link beach images
    for (let i = 0; i < b.images.length; i++) {
      const img = b.images[i];
      await prisma.beachImage.create({
        data: {
          beachId: beach.id,
          url: img.url,
          alt: img.alt,
          sortOrder: i,
        },
      });
    }

    // Link beach amenities
    for (const amName of b.amenities) {
      const amId = amenitiesMap.get(amName);
      if (amId) {
        await prisma.beachAmenity.upsert({
          where: { beachId_amenityId: { beachId: beach.id, amenityId: amId } },
          update: {},
          create: { beachId: beach.id, amenityId: amId },
        });
      }
    }

    // Link accommodations
    for (const acc of b.accommodations) {
      const createdAcc = await prisma.accommodation.upsert({
        where: { slug: acc.slug },
        update: {
          name: acc.name,
          description: acc.description,
          priceRange: acc.priceRange,
          facebookUrl: acc.facebookUrl,
          contactInfo: acc.contactInfo,
          checkInTime: acc.checkInTime,
          checkOutTime: acc.checkOutTime,
          maxGuests: acc.maxGuests,
          avgRating: acc.avgRating,
          reviewCount: acc.reviewCount,
        },
        create: {
          beachId: beach.id,
          name: acc.name,
          slug: acc.slug,
          description: acc.description,
          priceRange: acc.priceRange,
          facebookUrl: acc.facebookUrl,
          contactInfo: acc.contactInfo,
          checkInTime: acc.checkInTime,
          checkOutTime: acc.checkOutTime,
          maxGuests: acc.maxGuests,
          avgRating: acc.avgRating,
          reviewCount: acc.reviewCount,
        },
      });

      // Link room types
      for (const rt of acc.roomTypes) {
        await prisma.roomType.create({
          data: {
            accommodationId: createdAcc.id,
            name: rt.name,
            description: rt.description,
            price: rt.price,
            maxGuests: rt.maxGuests,
            amenities: rt.amenities,
          },
        });
      }

      // Link accommodation amenities
      for (const amName of acc.amenities) {
        const amId = amenitiesMap.get(amName);
        if (amId) {
          await prisma.accommodationAmenity.upsert({
            where: { accommodationId_amenityId: { accommodationId: createdAcc.id, amenityId: amId } },
            update: {},
            create: { accommodationId: createdAcc.id, amenityId: amId },
          });
        }
      }
    }
  }

  // 4. Approved Samaalon Blog Posts
  const blogTopics = [
    {
      title: "10 Best Beaches in Samal Island",
      slug: "10-best-beaches-in-samal",
      categorySlug: "beaches",
      content:
        "Samal Island (Island Garden City of Samal) is home to some of Davao's most striking coastlines. From the vibrant shorelines of Paradise Island and the cliffside diving cove of Canibad to the secluded Talisay tree canopy of Isla Reta on Talikud Island, discover fees, access routes, and local insider tips for all 10 top beaches.",
      featuredImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Things to Do in Samal Island",
      slug: "things-to-do-in-samal-island",
      categorySlug: "things-to-do",
      content:
        "Beyond lounging on white sand, Samal offers thrill-seeking water slide drops at Maxima Aqua Fun, island hopping around Vanishing Island, snorkeling at Coral Garden, and exploring the Monfort Bat Sanctuary.",
      featuredImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "How to Get to Samal Island",
      slug: "how-to-get-to-samal-island",
      categorySlug: "how-to-get-there",
      content:
        "Traveling from Davao City to Samal Island is fast and straightforward. Head to Sasa Wharf for car/passenger ferry transfers to Babak Port (15 minutes), or board passenger boats at Sta. Ana Wharf directly heading to Talikud Island.",
      featuredImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Best Accommodations in Samal",
      slug: "best-accommodations-in-samal",
      categorySlug: "accommodations",
      content:
        "Whether you're seeking 5-star luxury at Pearl Farm Beach Resort, family villas at Paradise Island, or rustic beachfront huts at Kaputian, here is your definitive guide to staying in Samal Island.",
      featuredImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Samal Island Travel Guide",
      slug: "samal-island-travel-guide",
      categorySlug: "travel-guides",
      content:
        "Planning your first visit to Samal Island? Learn about local environmental user fees, best travel months (November through May), tricycle fare estimates, and essential packing tips.",
      featuredImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const topic of blogTopics) {
    const catId = catMap.get(topic.categorySlug);
    await prisma.blogPost.upsert({
      where: { slug: topic.slug },
      update: {
        title: topic.title,
        content: topic.content,
        featuredImage: topic.featuredImage,
        categoryId: catId,
        published: true,
        publishedAt: new Date(),
      },
      create: {
        title: topic.title,
        slug: topic.slug,
        content: topic.content,
        featuredImage: topic.featuredImage,
        categoryId: catId,
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log("Seed completed: 10 Samal beaches, accommodations, rooms, amenities, and blogs seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
