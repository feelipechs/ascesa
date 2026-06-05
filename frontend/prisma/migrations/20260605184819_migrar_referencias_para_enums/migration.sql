/*
  Warnings:

  - You are about to drop the column `ageRangeId` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `speciesId` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `AnimalAgeRange` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimalSize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimalSpecies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FiscalNoteSubmission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `species` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE "Animal" DROP CONSTRAINT "Animal_ageRangeId_fkey";

-- DropForeignKey
ALTER TABLE "Animal" DROP CONSTRAINT "Animal_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "Animal" DROP CONSTRAINT "Animal_speciesId_fkey";

-- Drop tables before creating enums (tables create composite types with same names)
DROP TABLE "AnimalAgeRange";
DROP TABLE "AnimalSize";
DROP TABLE "AnimalSpecies";

-- CreateEnum
CREATE TYPE "AnimalSpecies" AS ENUM ('DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'FISH', 'OTHER');

-- CreateEnum
CREATE TYPE "AnimalSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "AnimalAgeRange" AS ENUM ('PUPPY', 'ADULT', 'SENIOR');

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "ageRangeId",
DROP COLUMN "sizeId",
DROP COLUMN "speciesId",
ADD COLUMN     "ageRange" "AnimalAgeRange",
ADD COLUMN     "size" "AnimalSize",
ADD COLUMN     "species" "AnimalSpecies" NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "publishedAt";

-- DropTable
DROP TABLE "FiscalNoteSubmission";
