import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function main() {
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // ROLES
  await prisma.role.createMany({
    data: [{ role: "ADMIN" }, { role: "USER" }],
  });

  // USERS
  const admin = await prisma.user.create({
    data: {
      firstName: "Mario",
      lastName: "Rossi",
      email: "admin@example.com",
      password: hashedPassword,
      role: { connect: { role: "ADMIN" } },
    },
  });

  const user1 = await prisma.user.create({
    data: {
      firstName: "Giuseppe",
      lastName: "Verdi",
      email: "giuseppe.verdi@example.com",
      password: hashedPassword,
      role: { connect: { role: "USER" } },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: "Anna",
      lastName: "Bianchi",
      email: "anna.bianchi@example.com",
      password: hashedPassword,
      role: { connect: { role: "USER" } },
    },
  });

  // STATES
  await prisma.stateReq.createMany({
    data: [
      { id: "ATTESA" },
      { id: "ACCETTATO" },
      { id: "RIFIUTATO" },
      { id: "PAGATO" },
    ],
  });

  // CATEGORIES
  await prisma.categoryReq.createMany({
    data: [
      { id: "cena" },
      { id: "trasporto" },
      { id: "alloggio" },
      { id: "formazione" },
      { id: "altro" },
    ],
  });

  // REFOUND REQUESTS
  await prisma.refoundReq.createMany({
    data: [
      {
        userId: user1.id,
        category: "cena",
        import: 45.50,
        description: "Cena con cliente",
        state: "ATTESA",
      },
      {
        userId: user1.id,
        category: "trasporto",
        import: 12.00,
        description: "Taxi aeroporto",
        state: "ACCETTATO",
        evaluatorId: admin.id,
        evaluationDate: new Date("2026-05-10"),
        payDate: new Date("2026-05-15"),
      },
      {
        userId: user2.id,
        category: "alloggio",
        import: 120.00,
        description: "Hotel trasferta Milano",
        state: "RIFIUTATO",
        evaluatorId: admin.id,
        evaluationDate: new Date("2026-05-12"),
        denyDescription: "Manca documento giustificativo",
      },
      {
        userId: user2.id,
        category: "formazione",
        import: 200.00,
        description: "Corso React avanzato",
        state: "PAGATO",
        evaluatorId: admin.id,
        evaluationDate: new Date("2026-04-20"),
        payDate: new Date("2026-04-30"),
      },
    ],
  });

  console.log("Seed completato");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });