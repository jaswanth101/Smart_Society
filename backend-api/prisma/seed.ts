import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create a Master Platform Admin Tenant (if your system needs a global one)
  // For standard usage, let's just create 'Alpha Society'
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'alpha-society' },
    update: {},
    create: {
      name: 'Alpha Society',
      slug: 'alpha-society',
      address: '100 Blockchain Ave',
      city: 'Bengaluru',
      state: 'Karnataka',
      subscriptionTier: 'ENTERPRISE',
      totalUnits: 500
    }
  });

  console.log(`✅ Created Tenant: ${tenant.name}`);

  // 2. Hash default password
  const passwordHash = await bcrypt.hash('1234567890', 10);

  // 3. Create a President (Admin)
  const admin = await prisma.user.upsert({
    where: { email: 'vanapallijaswanth12@gmail.com' },
    update: {},
    create: {
      name: 'Vanapalli Jaswanth (President)',
      email: 'vanapallijaswanth12@gmail.com',
      phone: '1234567890',
      password: passwordHash,
      role: UserRole.PRESIDENT,
      tenantId: tenant.id
    }
  });
  console.log(`✅ Created Admin User: ${admin.email} (Password: 1234567890)`);

  // 4. Create a Building and a Unit

  // Let's do it safely without raw upserts on non-unique fields:
  let b1 = await prisma.building.findFirst({ where: { name: 'Tower A', tenantId: tenant.id }});
  if (!b1) {
    b1 = await prisma.building.create({
      data: { name: 'Tower A', floors: 10, tenantId: tenant.id }
    });
  }

  let unitA = await prisma.unit.findFirst({ where: { flatNumber: '101A', tenantId: tenant.id }});
  if (!unitA) {
    unitA = await prisma.unit.create({
      data: {
        flatNumber: '101A',
        floor: 1,
        type: 'BHK3',
        sqft: 1500,
        occupancy: 'OCCUPIED',
        buildingId: b1.id,
        tenantId: tenant.id
      }
    });
  }

  // 5. Create a Resident
  const resident = await prisma.user.upsert({
    where: { email: 'spambro889@gmail.com' },
    update: {},
    create: {
      name: 'Spam Bro (Resident)',
      email: 'spambro889@gmail.com',
      phone: '0987654321',
      password: passwordHash,
      role: UserRole.FLAT_OWNER,
      tenantId: tenant.id,
      unitId: unitA.id
    }
  });
  console.log(`✅ Created Resident User: ${resident.email} (Password: 1234567890)`);

  // 6. Create a Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'jaswanthvanapalli12@gmail.com' },
    update: {},
    create: {
      name: 'Jaswanth Vanapalli (Super Admin)',
      email: 'jaswanthvanapalli12@gmail.com',
      phone: '1122334455',
      password: passwordHash,
      role: UserRole.SUPER_ADMIN,
      tenantId: tenant.id // Technically might belong to a master tenant, but attaching here for ease
    }
  });
  console.log(`✅ Created Super Admin User: ${superAdmin.email} (Password: 1234567890)`);

  console.log('🎉 Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
