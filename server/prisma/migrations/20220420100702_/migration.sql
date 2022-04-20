/*
  Warnings:

  - Added the required column `rating` to the `course_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course_reviews" ADD COLUMN     "rating" INTEGER NOT NULL;
