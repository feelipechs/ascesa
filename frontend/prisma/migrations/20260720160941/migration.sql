/*
  Warnings:

  - You are about to drop the column `displayOrder` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Volunteer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "displayOrder",
DROP COLUMN "isActive",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Volunteer" DROP COLUMN "birthDate";
