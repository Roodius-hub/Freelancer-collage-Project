/*
  Warnings:

  - A unique constraint covering the columns `[clientId,freelancerId,jobId,reviewerRole]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reviewerRole` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReviewRole" AS ENUM ('CLIENT', 'FREELANCER');

-- DropIndex
DROP INDEX "Review_clientId_freelancerId_jobId_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reviewerRole" "ReviewRole" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_clientId_freelancerId_jobId_reviewerRole_key" ON "Review"("clientId", "freelancerId", "jobId", "reviewerRole");
