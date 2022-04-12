/*
  Warnings:

  - You are about to drop the column `materials` on the `courses` table. All the data in the column will be lost.
  - Added the required column `materials_count` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materials_link` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "materials",
ADD COLUMN     "materials_count" INTEGER NOT NULL,
ADD COLUMN     "materials_link" TEXT NOT NULL;
