/*
  Warnings:

  - A unique constraint covering the columns `[clientId,jobId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Made the column `comment` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_freelancerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_jobId_fkey";

-- DropIndex
DROP INDEX "Review_jobId_freelancerId_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "comment" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Review_freelancerId_idx" ON "Review"("freelancerId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_clientId_jobId_key" ON "Review"("clientId", "jobId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
