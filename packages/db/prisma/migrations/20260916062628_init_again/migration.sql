/*
  Warnings:

  - A unique constraint covering the columns `[UserId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UserId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "UserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_UserId_key" ON "Conversation"("UserId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
