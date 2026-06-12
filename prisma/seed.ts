import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function main() {

  await prisma.refoundReq.deleteMany();
  await prisma.user.deleteMany();
  await prisma.categoryReq.deleteMany();
  await prisma.stateReq.deleteMany();
  await prisma.role.deleteMany();
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
  // REFOUND REQUESTS
  await prisma.refoundReq.createMany({
    data: [
      {
        userId: user1.id,
        category: "cena",
        import: 45.50,
        description: "Cena con cliente",
        state: "ATTESA",
        createdAt: new Date("2026-01-15"),
        expenseDate: new Date("2026-01-10"),
      },
      {
        userId: user1.id,
        category: "trasporto",
        import: 12.00,
        description: "Taxi aeroporto",
        state: "ATTESA",
        createdAt: new Date("2026-01-22"),
        expenseDate: new Date("2026-01-10"),
      },
      {
        userId: user2.id,
        category: "alloggio",
        import: 120.00,
        description: "Hotel trasferta Milano",
        state: "ATTESA",
        createdAt: new Date("2026-02-03"),
        expenseDate: new Date("2026-01-10"),
      },
      {
        userId: user2.id,
        category: "formazione",
        import: 200.00,
        description: "Corso React avanzato",
        state: "ATTESA",
        createdAt: new Date("2026-02-18"),
        expenseDate: new Date("2026-01-10"),
      },
      {
        userId: user1.id,
        category: "altro",
        import: 33.00,
        description: "Materiale ufficio",
        state: "ATTESA",
        createdAt: new Date("2026-03-05"),
        expenseDate: new Date("2026-01-10"),
      },
      {
        userId: user2.id,
        category: "trasporto",
        import: 55.00,
        description: "Treno Roma-Milano",
        state: "ATTESA",
        createdAt: new Date("2026-03-14"),
        expenseDate: new Date("2026-01-10"),
      },
      {
        userId: user1.id,
        category: "cena",
        import: 78.50,
        description: "Pranzo di lavoro con partner",
        state: "ATTESA",
        createdAt: new Date("2026-03-28"),
        expenseDate: new Date("2026-01-10"),
      },
      {
        userId: user2.id,
        category: "alloggio",
        import: 95.00,
        description: "Hotel trasferta Torino",
        state: "ATTESA",
        createdAt: new Date("2026-04-10"),
        expenseDate: new Date("2026-01-10"),
      },
      {
        userId: user1.id,
        category: "formazione",
        import: 350.00,
        description: "Conferenza Node.js",
        state: "ATTESA",
        createdAt: new Date("2026-04-22"),
        expenseDate: new Date("2026-01-10"),
      },
      {
        userId: user2.id,
        category: "altro",
        import: 18.00,
        description: "Spese postali documenti",
        state: "ATTESA",
        createdAt: new Date("2026-05-07"),
        expenseDate: new Date("2026-01-10"),
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