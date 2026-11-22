/*
  Warnings:

  - You are about to drop the column `UserId` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freelancerId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_UserId_fkey";

-- DropIndex
DROP INDEX "Conversation_UserId_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "UserId",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "freelancerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Conversation_clientId_idx" ON "Conversation"("clientId");

-- CreateIndex
CREATE INDEX "Conversation_freelancerId_idx" ON "Conversation"("freelancerId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
