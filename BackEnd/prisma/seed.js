import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: 'Tecnología', slug: 'tecnologia' },
  { name: 'Diseño', slug: 'diseno' },
  { name: 'Programación', slug: 'programacion' },
  { name: 'DevOps', slug: 'devops' },
  { name: 'Opinión', slug: 'opinion' },
];

async function main() {
  console.log(' Poblando categorías iniciales...');

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categorías creadas exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });