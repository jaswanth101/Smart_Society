import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Wiping old data for a fresh start...');
  
  // Wipe everything safely
  await prisma.staffAttendance.deleteMany();
  await prisma.staffMember.deleteMany();
  await prisma.gateLog.deleteMany();
  await prisma.rfidCard.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.feeRule.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.visitor.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.broadcast.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.election.deleteMany();
  await prisma.parkingSlot.deleteMany();
  await prisma.edgeNode.deleteMany();
  
  await prisma.user.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.building.deleteMany();
  await prisma.tenant.deleteMany();

  console.log('🌱 Creating Global Super Admin account...');

  const passwordHash = await bcrypt.hash('1234567890', 10);

  // We create Jaswanth as the god-level platform admin
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Jaswanth Vanapalli',
      email: 'jaswanthvanapalli12@gmail.com',
      phone: '9000000000',
      password: passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      // No tenantId needed if they use endpoints that don't enforce tenant layout,
      // BUT our schema requires a tenantId at the moment for everyone, even SuperAdmins, 
      // or does it? Let's check schema.
    }
  }).catch(async (e) => {
      // If tenant ID is strictly required by the DB constraints for user
      console.log('Creating a placeholder Platform Tenant for the Super Admin...');
      const sysTenant = await prisma.tenant.create({
          data: {
              name: 'SmartSociety Platform',
              slug: 'platform',
              address: 'Platform',
              city: 'Cloud',
              state: 'Web',
              isActive: true,
          }
      });
      return prisma.user.create({
        data: {
          name: 'Jaswanth Vanapalli',
          email: 'jaswanthvanapalli12@gmail.com',
          phone: '9000000000',
          password: passwordHash,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
          tenantId: sysTenant.id
        }
      });
  });

  console.log('✅ Success! Your sandbox is ready.');
  console.log('\n--- VERY FIRST LOGIN ---');
  console.log(`Email: ${superAdmin.email}`);
  console.log(`Password: 1234567890`);
  console.log('------------------------\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
