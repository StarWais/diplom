/*
  Warnings:

  - You are about to drop the column `olympiadStepAttemptId` on the `olympiad_task_answer_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `olympiad_task_answer_variants` table. All the data in the column will be lost.
  - Added the required column `points` to the `olympiad_tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "olympiad_task_answer_attempts" DROP CONSTRAINT "olympiad_task_answer_attempts_olympiadStepAttemptId_fkey";

-- AlterTable
ALTER TABLE "olympiad_task_answer_attempts" DROP COLUMN "olympiadStepAttemptId",
ADD COLUMN     "olympiad_step_attempt_id" INTEGER;

-- AlterTable
ALTER TABLE "olympiad_task_answer_variants" DROP COLUMN "points";

-- AlterTable
ALTER TABLE "olympiad_tasks" ADD COLUMN     "points" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "olympiad_task_answer_attempts" ADD CONSTRAINT "olympiad_task_answer_attempts_olympiad_step_attempt_id_fkey" FOREIGN KEY ("olympiad_step_attempt_id") REFERENCES "olympiad_step_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
