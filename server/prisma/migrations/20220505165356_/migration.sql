/*
  Warnings:

  - Changed the type of `finish_date` on the `olympiad_steps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "olympiad_steps" DROP COLUMN "finish_date",
ADD COLUMN     "finish_date" TIMESTAMP(3) NOT NULL;
