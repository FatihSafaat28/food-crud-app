import prisma from "@/app/lib/prisma";

async function main() {
  console.log("Seeding categories...");

  const categories = await prisma.category.createMany({
    data: [
      { name: "Steak", type: "makanan" },
      { name: "Rice", type: "makanan" },
      { name: "Coffee", type: "minuman" },
      { name: "Tea", type: "minuman" },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${categories.count} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
