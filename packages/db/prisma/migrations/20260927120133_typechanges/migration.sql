/*
  Warnings:

  - Changed the type of `budgetMax` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `budgetMin` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "budgetMax",
ADD COLUMN     "budgetMax" DOUBLE PRECISION NOT NULL,
DROP COLUMN "budgetMin",
ADD COLUMN     "budgetMin" DOUBLE PRECISION NOT NULL;
