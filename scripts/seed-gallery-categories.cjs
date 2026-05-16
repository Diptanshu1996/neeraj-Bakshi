const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  "Corporate Events",
  "Private Parties & Galas",
  "Luxury Weddings & Sangeet",
  "Dandiya & Garba Nights",
  "Sufi & Acoustic Nights",
];

async function main() {
  for (const category of categories) {
    await prisma.galleryCategory.upsert({
      where: { category },
      update: {},
      create: { category },
    });
  }

  const rows = await prisma.galleryCategory.findMany({ orderBy: { category: "asc" } });
  console.log("Categories in DB:", rows.map((row) => row.category).join(" | "));
}

main()
  .catch((error) => {
    console.error("Failed to seed gallery categories:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
