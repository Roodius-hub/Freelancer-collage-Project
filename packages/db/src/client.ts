import { PrismaClient } from "./generated/prisma/client";
import fs from "node:fs";
import  path from "node:path";
import { PrismaPg } from '@prisma/adapter-pg'

// const caPath = path.join(
//   __dirname,
//   "../certs/ca.pem"
// );
// const connectionString = process.env.DATABASE_URL!;

// 2. Define the path to your CA cert RELATIVE to the module, not cwd
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// const caPath = path.join(__dirname, "../certs/ca.pem");

// // 3. Verify the file exists (this will throw a clear error if missing)
// if (!fs.existsSync(caPath)) {
//   throw new Error(
//     `CA Certificate not found at ${caPath}. Please ensure your 'certs/ca.pem' file exists in the project root.`
//   );
// }

function loadCaCert(): string {
  // 1. Content from env (if you ever need it, e.g. Vercel)
  // if (process.env.DATABASE_CA_CERT) {
  //   const ca = process.env.DATABASE_CA_CERT.replace(/\\n/g, "\n");
  //   if (ca.includes("-----END CERTIFICATE-----")) return ca;
  //   throw new Error("DATABASE_CA_CERT is truncated — missing END line.");
  // }

  // 2. File path (recommended for dev)
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
