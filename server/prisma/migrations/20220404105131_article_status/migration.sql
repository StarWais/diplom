/*
  Warnings:

  - Added the required column `status` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "status" "ArticleStatus" NOT NULL;
