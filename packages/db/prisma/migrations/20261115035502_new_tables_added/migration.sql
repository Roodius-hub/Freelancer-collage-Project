/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `identityVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `paymentVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileCompleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "identityVerified",
DROP COLUMN "paymentVerified",
DROP COLUMN "phoneVerified",
DROP COLUMN "profileCompleted",
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "phoneVerifiedAt" TIMESTAMP(3);
