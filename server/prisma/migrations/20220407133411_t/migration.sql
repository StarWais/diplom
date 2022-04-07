-- DropForeignKey
ALTER TABLE "CourseModule" DROP CONSTRAINT "CourseModule_course_id_fkey";

-- DropForeignKey
ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_article_id_fkey";

-- DropForeignKey
ALTER TABLE "article_dislikes" DROP CONSTRAINT "article_dislikes_article_id_fkey";

-- DropForeignKey
ALTER TABLE "article_likes" DROP CONSTRAINT "article_likes_article_id_fkey";

-- DropForeignKey
ALTER TABLE "course_applications" DROP CONSTRAINT "course_applications_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_education_steps" DROP CONSTRAINT "course_education_steps_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_reviews" DROP CONSTRAINT "course_reviews_course_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_applications" DROP CONSTRAINT "olympiad_applications_course_id_fkey";

-- DropForeignKey
ALTER TABLE "olympiad_reviews" DROP CONSTRAINT "olympiad_reviews_olympiad_id_fkey";

-- AddForeignKey
ALTER TABLE "CourseModule" ADD CONSTRAINT "CourseModule_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_education_steps" ADD CONSTRAINT "course_education_steps_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_applications" ADD CONSTRAINT "course_applications_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_applications" ADD CONSTRAINT "olympiad_applications_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "olympiads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_reviews" ADD CONSTRAINT "olympiad_reviews_olympiad_id_fkey" FOREIGN KEY ("olympiad_id") REFERENCES "olympiads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_dislikes" ADD CONSTRAINT "article_dislikes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
