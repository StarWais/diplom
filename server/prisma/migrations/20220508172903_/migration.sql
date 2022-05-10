/*
  Warnings:

  - You are about to drop the column `appliciant_name` on the `course_applications` table. All the data in the column will be lost.
  - You are about to drop the column `appliciant_phone` on the `course_applications` table. All the data in the column will be lost.
  - Added the required column `applicant_name` to the `course_applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicant_phone` to the `course_applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course_applications" DROP COLUMN "appliciant_name",
DROP COLUMN "appliciant_phone",
ADD COLUMN     "applicant_name" TEXT NOT NULL,
ADD COLUMN     "applicant_phone" TEXT NOT NULL;
