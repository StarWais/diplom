/*
  Warnings:

  - You are about to drop the column `length` on the `courses` table. All the data in the column will be lost.
  - Added the required column `finish_date` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "length",
ADD COLUMN     "finish_date" TIMESTAMP(3) NOT NULL;
