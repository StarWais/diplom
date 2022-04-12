/*
  Warnings:

  - You are about to drop the column `task_id` on the `olympiad_example_tasks` table. All the data in the column will be lost.
  - You are about to drop the `avatars` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image_link` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_file_id_fkey";

-- DropForeignKey
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_user_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_example_tasks" DROP CONSTRAINT "olympiad_example_tasks_task_id_fkey";

-- AlterTable
ALTER TABLE "course_reviews" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "image_link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "olympiad_example_tasks" DROP COLUMN "task_id",
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "olympiad_reviews" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_link" TEXT;

-- DropTable
DROP TABLE "avatars";

-- DropTable
DROP TABLE "files";
