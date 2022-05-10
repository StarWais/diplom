/*
  Warnings:

  - You are about to drop the column `has_free_places` on the `courses` table. All the data in the column will be lost.
  - Added the required column `places_availiable` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "has_free_places",
ADD COLUMN     "places_availiable" INTEGER NOT NULL;
