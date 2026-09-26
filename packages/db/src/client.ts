import { PrismaClient } from "./generated/prisma/client";
import fs from "node:fs";
import  path from "node:path";
import { PrismaPg } from '@prisma/adapter-pg'


function loadCaCert(): string {
  const caPath =
    process.env.DATABASE_CA_CERT_PATH ??
    path.join(process.cwd(), "certs", "ca.pem");

  if (!fs.existsSync(caPath)) {
    throw new Error(`CA cert not found at ${caPath}`);
  }
  return fs.readFileSync(caPath, "utf-8");
}

const ca = loadCaCert(); // whatever your loading function is
console.log("CA cert loaded, length:", ca.length);
console.log("First line:", ca.split("\n")[0]);
console.log("Last line:", ca.trim().split("\n").pop());

// Create a new Driver Adapter instance for PrismaPostgres
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
     ca: loadCaCert(),
    rejectUnauthorized: true,
  },  
  connectionTimeoutMillis: 5000
})


const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
