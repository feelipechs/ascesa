/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `GalleryImage` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `TeamMember` table. All the data in the column will be lost.
  - Added the required column `mediaId` to the `GalleryImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoMediaId` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "coverUrl",
ADD COLUMN     "coverMediaId" TEXT;

-- AlterTable
ALTER TABLE "Area" DROP COLUMN "coverUrl",
ADD COLUMN     "coverMediaId" TEXT;

-- AlterTable
ALTER TABLE "GalleryImage" DROP COLUMN "url",
ADD COLUMN     "mediaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "logoUrl",
ADD COLUMN     "logoMediaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "coverUrl",
ADD COLUMN     "coverMediaId" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "coverUrl",
ADD COLUMN     "coverMediaId" TEXT;

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "photoUrl",
ADD COLUMN     "photoMediaId" TEXT;

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "originalName" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_key_key" ON "Media"("key");

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_photoMediaId_fkey" FOREIGN KEY ("photoMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_logoMediaId_fkey" FOREIGN KEY ("logoMediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
