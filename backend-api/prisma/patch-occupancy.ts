import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing Flat 101 occupancy...');
  const result = await prisma.unit.updateMany({
    where: {
      flatNumber: '101',
      occupancy: 'VACANT',
    },
    data: {
      occupancy: 'OCCUPIED',
    },
  });
  console.log(`Updated ${result.count} units.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
