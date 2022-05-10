/*
  Warnings:

  - You are about to drop the column `text` on the `course_education_steps` table. All the data in the column will be lost.
  - Added the required column `description` to the `course_education_steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course_education_steps" DROP COLUMN "text",
ADD COLUMN     "description" TEXT NOT NULL;
