import { PrismaClient, Role, HotelStatus, RoomStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  const hash = await bcrypt.hash('Password123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@stayease.com' },
    update: {},
    create: {
      email: 'admin@stayease.com',
      passwordHash: hash,
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.ADMIN,
      isVerified: true,
      wallet: { create: { balance: 0 } },
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@stayease.com' },
    update: {},
    create: {
      email: 'owner@stayease.com',
      passwordHash: hash,
      firstName: 'Hotel',
      lastName: 'Owner',
      role: Role.HOTEL_OWNER,
      isVerified: true,
      wallet: { create: { balance: 0 } },
    },
  });

  await prisma.user.upsert({
    where: { email: 'guest@stayease.com' },
    update: {},
    create: {
      email: 'guest@stayease.com',
      passwordHash: hash,
      firstName: 'Jane',
      lastName: 'Guest',
      role: Role.GUEST,
      isVerified: true,
      wallet: { create: { balance: 500 } },
    },
  });

  const hotelsData = [
    {
      name: 'Grand Horizon Hotel',
      description: 'Luxury waterfront hotel with stunning ocean views, world-class dining, and a full-service spa.',
      address: '1 Ocean Drive, Miami Beach, FL 33139',
      city: 'Miami',
      country: 'United States',
      starRating: 5,
      amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'WiFi', 'Parking', 'Beach Access'],
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      isFeatured: true,
      latitude: 25.7617,
      longitude: -80.1918,
      checkInTime: '15:00',
      checkOutTime: '11:00',
    },
    {
      name: 'The Urban Nest',
      description: 'Boutique hotel in the heart of downtown, perfect for business and leisure travelers.',
      address: '42 Main Street, New York, NY 10001',
      city: 'New York',
      country: 'United States',
      starRating: 4,
      amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym', 'Concierge', 'Business Center'],
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      isFeatured: true,
      latitude: 40.7128,
      longitude: -74.006,
      checkInTime: '14:00',
      checkOutTime: '12:00',
    },
    {
      name: 'Mountain Lodge Retreat',
      description: 'Cozy alpine lodge surrounded by pine forests with ski-in/ski-out access.',
      address: '88 Summit Road, Aspen, CO 81611',
      city: 'Aspen',
      country: 'United States',
      starRating: 4,
      amenities: ['Ski Storage', 'Fireplace Lounge', 'Hot Tub', 'WiFi', 'Restaurant', 'Shuttle'],
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      isFeatured: true,
      latitude: 39.1911,
      longitude: -106.8175,
      checkInTime: '16:00',
      checkOutTime: '10:00',
    },
  ];

  for (const h of hotelsData) {
    const { imageUrl, ...hotelFields } = h;
    const slug = slugify(h.name);

    const hotel = await prisma.hotel.upsert({
      where: { slug },
      update: {},
      create: {
        ...hotelFields,
        slug,
        status: HotelStatus.APPROVED,
        ownerId: owner.id,
        commission: 15,
        images: {
          create: [{ url: imageUrl, isPrimary: true }],
        },
        policies: {
          create: {
            cancellationDays: 2,
            petAllowed: false,
            smokingAllowed: false,
            childrenAllowed: true,
            extraInfo: 'Complimentary breakfast available for suite guests.',
          },
        },
      },
    });

    const roomsData = [
      {
        name: 'Standard Room',
        description: 'Comfortable room with all essential amenities.',
        pricePerNight: 120,
        capacity: 2,
        bedType: 'Queen',
        amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
        imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      },
      {
        name: 'Deluxe Suite',
        description: 'Spacious suite with separate living area and premium views.',
        pricePerNight: 280,
        capacity: 3,
        bedType: 'King',
        amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub', 'Balcony', 'Room Service'],
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      },
    ];

    for (const r of roomsData) {
      const { imageUrl: roomImg, ...roomFields } = r;
      await prisma.room.create({
        data: {
          ...roomFields,
          status: RoomStatus.AVAILABLE,
          hotelId: hotel.id,
          images: {
            create: [{ url: roomImg, order: 0 }],
          },
        },
      });
    }
  }

  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      discount: 20,
      isPercentage: true,
      maxUses: 100,
      usedCount: 0,
      expiresAt: new Date('2027-12-31'),
      isActive: true,
    },
  });

  console.log('✅ Seed complete');
  console.log('  admin@stayease.com  / Password123!  (ADMIN)');
  console.log('  owner@stayease.com  / Password123!  (HOTEL_OWNER)');
  console.log('  guest@stayease.com  / Password123!  (GUEST)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
