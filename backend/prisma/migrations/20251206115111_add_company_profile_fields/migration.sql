/*
  Warnings:

  - You are about to drop the column `location` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "location",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
