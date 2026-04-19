import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ═══════════════════════════════════════════════════════
  // 1. CREATE SOCIETY (TENANT)
  // ═══════════════════════════════════════════════════════
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
      totalUnits: 500,
      hasAmenities: true,
      hasElections: true,
      hasHelpdesk: true,
      hasVisitorGate: true,
    }
  });
  console.log(`✅ Tenant: ${tenant.name}`);

  // ═══════════════════════════════════════════════════════
  // 2. CREATE BUILDINGS & UNITS
  // ═══════════════════════════════════════════════════════
  let towerA = await prisma.building.findFirst({ where: { name: 'Tower A', tenantId: tenant.id } });
  if (!towerA) {
    towerA = await prisma.building.create({
      data: { name: 'Tower A', floors: 10, tenantId: tenant.id }
    });
  }

  let towerB = await prisma.building.findFirst({ where: { name: 'Tower B', tenantId: tenant.id } });
  if (!towerB) {
    towerB = await prisma.building.create({
      data: { name: 'Tower B', floors: 8, tenantId: tenant.id }
    });
  }

  // Create 4 units across 2 towers
  const unitData = [
    { flatNumber: 'A-101', floor: 1, type: 'BHK3' as const, sqft: 1500, buildingId: towerA.id },
    { flatNumber: 'A-202', floor: 2, type: 'BHK2' as const, sqft: 1100, buildingId: towerA.id },
    { flatNumber: 'B-101', floor: 1, type: 'BHK3' as const, sqft: 1400, buildingId: towerB.id },
    { flatNumber: 'B-303', floor: 3, type: 'BHK2' as const, sqft: 1050, buildingId: towerB.id },
  ];

  const units: any[] = [];
  for (const u of unitData) {
    let unit = await prisma.unit.findFirst({ where: { flatNumber: u.flatNumber, tenantId: tenant.id } });
    if (!unit) {
      unit = await prisma.unit.create({
        data: { ...u, occupancy: 'OCCUPIED', tenantId: tenant.id }
      });
    }
    units.push(unit);
  }
  console.log(`✅ ${units.length} Units created across Tower A + Tower B`);

  // ═══════════════════════════════════════════════════════
  // 3. CREATE ALL 9 ROLES (same password for testing)
  // ═══════════════════════════════════════════════════════
  const pw = await bcrypt.hash('Test@1234', 10);

  const usersToCreate = [
    // Committee Members
    { name: 'Jaswanth Vanapalli',  email: 'president@alpha.test',  phone: '9000000001', role: UserRole.PRESIDENT,       unitId: units[0].id },
    { name: 'Priya Secretary',     email: 'secretary@alpha.test',  phone: '9000000002', role: UserRole.SECRETARY,       unitId: units[0].id },
    { name: 'Ravi Treasurer',      email: 'treasurer@alpha.test',  phone: '9000000003', role: UserRole.TREASURER,       unitId: units[1].id },
    { name: 'Kiran Supervisor',    email: 'supervisor@alpha.test', phone: '9000000004', role: UserRole.SUPERVISOR,      unitId: null },

    // Residents
    { name: 'Amit Owner',          email: 'owner@alpha.test',      phone: '9000000005', role: UserRole.FLAT_OWNER,      unitId: units[2].id },
    { name: 'Neha Tenant',         email: 'tenant@alpha.test',     phone: '9000000006', role: UserRole.TENANT,          unitId: units[3].id },

    // Ground Staff
    { name: 'Raju Guard',          email: 'guard@alpha.test',      phone: '9000000007', role: UserRole.SECURITY_GUARD,  unitId: null },
    { name: 'Babu Plumber',        email: 'staff@alpha.test',      phone: '9000000008', role: UserRole.STAFF,           unitId: null },

    // Platform Admin
    { name: 'Super Admin',         email: 'admin@alpha.test',      phone: '9000000009', role: UserRole.SUPER_ADMIN,     unitId: null },
  ];

  for (const u of usersToCreate) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: pw,
        role: u.role,
        tenantId: tenant.id,
        unitId: u.unitId,
        isActive: true,
      }
    });
  }
  console.log(`✅ 9 Users created (all roles). Password: Test@1234`);

  // ═══════════════════════════════════════════════════════
  // 4. FEE RULES
  // ═══════════════════════════════════════════════════════
  const feeRules = [
    { unitType: 'BHK2' as const, baseAmount: 3500, lateFeePercent: 5, dueDay: 5 },
    { unitType: 'BHK3' as const, baseAmount: 4500, lateFeePercent: 5, dueDay: 5 },
  ];

  for (const rule of feeRules) {
    const exists = await prisma.feeRule.findFirst({ where: { tenantId: tenant.id, unitType: rule.unitType } });
    if (!exists) {
      await prisma.feeRule.create({ data: { ...rule, tenantId: tenant.id } });
    }
  }
  console.log(`✅ Fee rules: BHK2=₹3,500 | BHK3=₹4,500 | Late fee=5% | Due day=5th`);

  // ═══════════════════════════════════════════════════════
  // 5. AMENITIES
  // ═══════════════════════════════════════════════════════
  const amenities = [
    { name: 'Swimming Pool', maxCapacity: 30, quotaPerWeek: 3, timings: '6AM-10AM, 4PM-8PM', rfidRequired: true },
    { name: 'Gym',           maxCapacity: 20, quotaPerWeek: 7, timings: '5AM-10PM',          rfidRequired: true },
    { name: 'Community Hall', maxCapacity: 100, quotaPerWeek: 1, timings: 'By booking',      rfidRequired: false },
    { name: 'Games Room',    maxCapacity: 10, quotaPerWeek: 5, timings: '10AM-9PM',          rfidRequired: false },
  ];

  for (const a of amenities) {
    const exists = await prisma.amenity.findFirst({ where: { tenantId: tenant.id, name: a.name } });
    if (!exists) {
      await prisma.amenity.create({ data: { ...a, tenantId: tenant.id } });
    }
  }
  console.log(`✅ 4 Amenities created`);

  // ═══════════════════════════════════════════════════════
  // 6. STAFF MEMBERS
  // ═══════════════════════════════════════════════════════
  const staffMembers = [
    { name: 'Babu Plumber',   role: 'Plumber',     department: 'Maintenance', phone: '9000000008', shift: 'DAY' as const },
    { name: 'Suresh Electrician', role: 'Electrician', department: 'Maintenance', phone: '9000000010', shift: 'DAY' as const },
    { name: 'Lakshmi Cleaner', role: 'Housekeeping', department: 'Cleaning',    phone: '9000000011', shift: 'MORNING' as const },
  ];

  for (const s of staffMembers) {
    const exists = await prisma.staffMember.findFirst({ where: { tenantId: tenant.id, phone: s.phone } });
    if (!exists) {
      await prisma.staffMember.create({ data: { ...s, tenantId: tenant.id } });
    }
  }
  console.log(`✅ 3 Staff members created`);

  // ═══════════════════════════════════════════════════════
  // 7. RFID CARDS
  // ═══════════════════════════════════════════════════════
  const rfidCards = [
    { uid: 'RFID-A001', holderName: 'Jaswanth Vanapalli', holderType: 'OWNER' },
    { uid: 'RFID-A002', holderName: 'Amit Owner',         holderType: 'OWNER' },
    { uid: 'RFID-T001', holderName: 'Neha Tenant',        holderType: 'TENANT' },
    { uid: 'RFID-S001', holderName: 'Raju Guard',         holderType: 'STAFF' },
  ];

  for (const card of rfidCards) {
    const exists = await prisma.rfidCard.findFirst({ where: { uid: card.uid } });
    if (!exists) {
      await prisma.rfidCard.create({ data: { ...card, tenantId: tenant.id } });
    }
  }
  console.log(`✅ 4 RFID cards issued`);

  // ═══════════════════════════════════════════════════════
  // 8. PARKING SLOTS
  // ═══════════════════════════════════════════════════════
  const parkingSlots = [
    { slotNumber: 'P-A01', zone: 'Basement-1', vehicleType: 'CAR' as const,  vehicle: 'KA-05-AB-1234', unitId: units[0].id, status: 'ASSIGNED' as const },
    { slotNumber: 'P-A02', zone: 'Basement-1', vehicleType: 'BIKE' as const, vehicle: 'KA-05-CD-5678', unitId: units[0].id, status: 'ASSIGNED' as const },
    { slotNumber: 'P-B01', zone: 'Basement-2', vehicleType: 'CAR' as const,  vehicle: 'KA-05-EF-9012', unitId: units[2].id, status: 'ASSIGNED' as const },
    { slotNumber: 'P-G01', zone: 'Guest',      vehicleType: 'CAR' as const,  vehicle: null,             unitId: null,        status: 'AVAILABLE' as const },
  ];

  for (const slot of parkingSlots) {
    const exists = await prisma.parkingSlot.findFirst({ where: { tenantId: tenant.id, slotNumber: slot.slotNumber } });
    if (!exists) {
      await prisma.parkingSlot.create({ data: { ...slot, tenantId: tenant.id } });
    }
  }
  console.log(`✅ 4 Parking slots configured`);

  // ═══════════════════════════════════════════════════════
  // 9. A SAMPLE NOTICE
  // ═══════════════════════════════════════════════════════
  const noticeExists = await prisma.notice.findFirst({ where: { tenantId: tenant.id, title: 'Welcome to SmartSociety 360!' } });
  if (!noticeExists) {
    await prisma.notice.create({
      data: {
        tenantId: tenant.id,
        title: 'Welcome to SmartSociety 360!',
        body: 'Your digital society platform is now live. All residents can view notices, pay dues, book amenities, and raise helpdesk tickets from the dashboard.',
        category: 'GENERAL',
        isPinned: true,
        authorName: 'Jaswanth Vanapalli',
        totalRecipients: 9
      }
    });
  }
  console.log(`✅ Welcome notice posted`);

  // ═══════════════════════════════════════════════════════
  console.log('\n🎉 Seeding complete! Here are your test accounts:\n');
  console.log('┌─────────────────┬──────────────────────────┬────────────┐');
  console.log('│ Role            │ Email                    │ Password   │');
  console.log('├─────────────────┼──────────────────────────┼────────────┤');
  console.log('│ SUPER_ADMIN     │ admin@alpha.test         │ Test@1234  │');
  console.log('│ PRESIDENT       │ president@alpha.test     │ Test@1234  │');
  console.log('│ SECRETARY       │ secretary@alpha.test     │ Test@1234  │');
  console.log('│ TREASURER       │ treasurer@alpha.test     │ Test@1234  │');
  console.log('│ SUPERVISOR      │ supervisor@alpha.test    │ Test@1234  │');
  console.log('│ FLAT_OWNER      │ owner@alpha.test         │ Test@1234  │');
  console.log('│ TENANT          │ tenant@alpha.test        │ Test@1234  │');
  console.log('│ SECURITY_GUARD  │ guard@alpha.test         │ Test@1234  │');
  console.log('│ STAFF           │ staff@alpha.test         │ Test@1234  │');
  console.log('└─────────────────┴──────────────────────────┴────────────┘');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
