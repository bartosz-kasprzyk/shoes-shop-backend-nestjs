import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const brands = [
    'Nike',
    'Adidas',
    'Puma',
    'Reebok',
    'New Balance',
    'Vans',
    'Converse',
    'HUGO BOSS',
  ];
  for (const name of brands) {
    await prisma.brand.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const sizes = [
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
  ];
  for (const name of sizes) {
    await prisma.size.upsert({ where: { name }, update: {}, create: { name } });
  }

  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Grey', 'Multi'];
  for (const name of colors) {
    await prisma.color.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const genders = ['Men', 'Women'];
  for (const name of genders) {
    await prisma.gender.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const categories = [
    'Casual',
    'Sneakers',
    'Running',
    'Basketball',
    'Trekking',
    'Formal',
    'Boots',
  ];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
