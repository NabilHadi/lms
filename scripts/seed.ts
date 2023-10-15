const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Information Technology" },
        { name: "Web Development" },
        { name: "Mobile Development" },
        { name: "Data Science" },
        { name: "Artificial Intelligence" },
        { name: "Machine Learning" },
      ],
    });
    console.log("Seeding finished.");
  } catch (error) {
    console.log("Errpr seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
