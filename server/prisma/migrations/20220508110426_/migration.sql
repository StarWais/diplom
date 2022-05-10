/*
  Warnings:

  - You are about to drop the column `author_id` on the `course_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `olympiad_reviews` table. All the data in the column will be lost.
  - Added the required column `student_id` to the `course_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `olympiad_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "course_applications" DROP CONSTRAINT "course_applications_student_id_fkey";

-- DropForeignKey
ALTER TABLE "course_reviews" DROP CONSTRAINT "course_reviews_author_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_applications" DROP CONSTRAINT "olympiad_applications_student_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_reviews" DROP CONSTRAINT "olympiad_reviews_author_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_step_results" DROP CONSTRAINT "olympiad_step_results_olympiad_step_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_step_results" DROP CONSTRAINT "olympiad_step_results_student_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_task_answer_attempts" DROP CONSTRAINT "olympiad_task_answer_attempts_olympiadStepAttemptId_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_task_answer_attempts" DROP CONSTRAINT "olympiad_task_answer_attempts_olympiad_task_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_task_answer_variants" DROP CONSTRAINT "olympiad_task_answer_variants_olympiad_task_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_tasks" DROP CONSTRAINT "olympiad_tasks_olympiad_step_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher_ratings" DROP CONSTRAINT "teacher_ratings_student_id_fkey";

-- AlterTable
ALTER TABLE "course_reviews" DROP COLUMN "author_id",
ADD COLUMN     "student_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "olympiad_reviews" DROP COLUMN "author_id",
ADD COLUMN     "student_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "olympiad_applications" ADD CONSTRAINT "olympiad_applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_step_results" ADD CONSTRAINT "olympiad_step_results_olympiad_step_id_fkey" FOREIGN KEY ("olympiad_step_id") REFERENCES "olympiad_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_step_results" ADD CONSTRAINT "olympiad_step_results_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_tasks" ADD CONSTRAINT "olympiad_tasks_olympiad_step_id_fkey" FOREIGN KEY ("olympiad_step_id") REFERENCES "olympiad_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_task_answer_attempts" ADD CONSTRAINT "olympiad_task_answer_attempts_olympiadStepAttemptId_fkey" FOREIGN KEY ("olympiadStepAttemptId") REFERENCES "olympiad_step_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_task_answer_attempts" ADD CONSTRAINT "olympiad_task_answer_attempts_olympiad_task_id_fkey" FOREIGN KEY ("olympiad_task_id") REFERENCES "olympiad_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_task_answer_variants" ADD CONSTRAINT "olympiad_task_answer_variants_olympiad_task_id_fkey" FOREIGN KEY ("olympiad_task_id") REFERENCES "olympiad_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_reviews" ADD CONSTRAINT "olympiad_reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_applications" ADD CONSTRAINT "course_applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_ratings" ADD CONSTRAINT "teacher_ratings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
