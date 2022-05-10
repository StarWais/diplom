/*
  Warnings:

  - You are about to drop the column `places_availiable` on the `courses` table. All the data in the column will be lost.
  - Added the required column `places_available` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "places_availiable",
ADD COLUMN     "places_available" INTEGER NOT NULL;
