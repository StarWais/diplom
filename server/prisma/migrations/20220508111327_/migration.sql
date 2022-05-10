/*
  Warnings:

  - The `status` column on the `articles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `published` on the `course_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `olympiad_reviews` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PublishingStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "status",
ADD COLUMN     "status" "PublishingStatus" NOT NULL DEFAULT E'DRAFT';

-- AlterTable
ALTER TABLE "course_reviews" DROP COLUMN "published",
ADD COLUMN     "status" "PublishingStatus" NOT NULL DEFAULT E'DRAFT';

-- AlterTable
ALTER TABLE "olympiad_reviews" DROP COLUMN "published",
ADD COLUMN     "status" "PublishingStatus" NOT NULL DEFAULT E'DRAFT';

-- DropEnum
DROP TYPE "ArticleStatus";
