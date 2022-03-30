/*
  Warnings:

  - You are about to drop the column `about` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "materials_link" TEXT;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "about" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "about",
DROP COLUMN "name",
ALTER COLUMN "birth_date" DROP NOT NULL;
