-- DropForeignKey
ALTER TABLE "course_applications" DROP CONSTRAINT "course_applications_student_id_fkey";

-- AlterTable
ALTER TABLE "course_applications" ALTER COLUMN "student_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "course_applications" ADD CONSTRAINT "course_applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
