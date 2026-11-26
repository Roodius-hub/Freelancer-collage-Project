/*
  Warnings:

  - A unique constraint covering the columns `[clientId,freelancerId,jobId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Review_clientId_jobId_key";

-- CreateIndex
CREATE INDEX "Review_clientId_idx" ON "Review"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_clientId_freelancerId_jobId_key" ON "Review"("clientId", "freelancerId", "jobId");
