const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      fullName: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Super Admin created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });