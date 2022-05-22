-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "PublishingStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('CREATED', 'FULFILLED', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "OlympiadParticipationType" AS ENUM ('FREE', 'PAID');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('PENDING', 'FULFILLED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'ABSENT_WITH_REASON');

-- CreateEnum
CREATE TYPE "OlympiadTaskAnswerType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE');

-- CreateEnum
CREATE TYPE "OlympiadAttemptStatus" AS ENUM ('PENDING', 'FULFILLED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'STUDENT',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "phone" TEXT,
    "can_publish" BOOLEAN NOT NULL DEFAULT false,
    "gender" "Gender" NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "avatar_link" TEXT,
    "new_email" TEXT,
    "new_email_confirmed" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "educational_institution" TEXT,
    "grade" INTEGER,
    "teachers" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "about" TEXT,
    "specialisations" TEXT[],
    "telegram_link" TEXT,
    "whatsapp_link" TEXT,
    "viber_link" TEXT,
    "vk_link" TEXT,
    "skype_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_ratings" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_link" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT E'PENDING',
    "expires_in" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_change_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT E'PENDING',
    "expires_in" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_change_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT E'PENDING',
    "expires_in" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registration_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiads" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "participation_type" "OlympiadParticipationType" NOT NULL,
    "grade" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "example_tasks_images" TEXT[],
    "image_link" TEXT NOT NULL,
    "rewards" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_applications" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_steps" (
    "id" SERIAL NOT NULL,
    "olympiad_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "finish_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_step_results" (
    "id" SERIAL NOT NULL,
    "olympiad_step_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "next_step_availiable" BOOLEAN NOT NULL DEFAULT false,
    "place" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_step_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_step_attempts" (
    "id" SERIAL NOT NULL,
    "olympiad_step_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_step_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_tasks" (
    "id" SERIAL NOT NULL,
    "olympiad_step_id" INTEGER NOT NULL,
    "task" TEXT NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL,
    "answer_type" "OlympiadTaskAnswerType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_task_answer_attempts" (
    "id" SERIAL NOT NULL,
    "olympiad_task_id" INTEGER NOT NULL,
    "olympiad_step_attempt_id" INTEGER,
    "student_id" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_task_answer_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_task_answer_variants" (
    "id" SERIAL NOT NULL,
    "olympiad_task_id" INTEGER NOT NULL,
    "right_answer" BOOLEAN NOT NULL,
    "text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_task_answer_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_reviews" (
    "id" SERIAL NOT NULL,
    "olympiad_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "status" "PublishingStatus" NOT NULL DEFAULT E'DRAFT',
    "rating" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grade" INTEGER NOT NULL,
    "to_whom" TEXT[],
    "possibilities" TEXT[],
    "start_date" TIMESTAMP(3) NOT NULL,
    "places_available" INTEGER NOT NULL,
    "materials_link" TEXT NOT NULL,
    "materials_count" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image_link" TEXT NOT NULL,
    "erip_number" TEXT NOT NULL,
    "finish_date" TIMESTAMP(3) NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses_modules" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_education_steps" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "step" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_education_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_applications" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "student_id" INTEGER,
    "applicant_name" TEXT NOT NULL,
    "applicant_phone" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT E'CREATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_attendances" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "reason" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_reviews" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "status" "PublishingStatus" NOT NULL DEFAULT E'DRAFT',
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishingStatus" NOT NULL DEFAULT E'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_likes" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_dislikes" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_dislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_comments" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentToTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_NewsToNewsTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OlympiadToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OlympiadToOlympiadTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OlympiadApplicationToOlympiadStep" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OlympiadTaskAnswerAttemptToOlympiadTaskAnswerVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToCourseTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ArticleToArticleTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "news_tags_name_key" ON "news_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "email_change_tokens_token_key" ON "email_change_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "registration_tokens_token_key" ON "registration_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "olympiad_tags_name_key" ON "olympiad_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "courses_tags_name_key" ON "courses_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "article_tags_name_key" ON "article_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentToTeacher_AB_unique" ON "_StudentToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentToTeacher_B_index" ON "_StudentToTeacher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_NewsToNewsTag_AB_unique" ON "_NewsToNewsTag"("A", "B");

-- CreateIndex
CREATE INDEX "_NewsToNewsTag_B_index" ON "_NewsToNewsTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OlympiadToStudent_AB_unique" ON "_OlympiadToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_OlympiadToStudent_B_index" ON "_OlympiadToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OlympiadToOlympiadTag_AB_unique" ON "_OlympiadToOlympiadTag"("A", "B");

-- CreateIndex
CREATE INDEX "_OlympiadToOlympiadTag_B_index" ON "_OlympiadToOlympiadTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OlympiadApplicationToOlympiadStep_AB_unique" ON "_OlympiadApplicationToOlympiadStep"("A", "B");

-- CreateIndex
CREATE INDEX "_OlympiadApplicationToOlympiadStep_B_index" ON "_OlympiadApplicationToOlympiadStep"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OlympiadTaskAnswerAttemptToOlympiadTaskAnswerVariant_AB_unique" ON "_OlympiadTaskAnswerAttemptToOlympiadTaskAnswerVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_OlympiadTaskAnswerAttemptToOlympiadTaskAnswerVariant_B_index" ON "_OlympiadTaskAnswerAttemptToOlympiadTaskAnswerVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToStudent_AB_unique" ON "_CourseToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToStudent_B_index" ON "_CourseToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToCourseTag_AB_unique" ON "_CourseToCourseTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToCourseTag_B_index" ON "_CourseToCourseTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToArticleTag_AB_unique" ON "_ArticleToArticleTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToArticleTag_B_index" ON "_ArticleToArticleTag"("B");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_ratings" ADD CONSTRAINT "teacher_ratings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_ratings" ADD CONSTRAINT "teacher_ratings_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_change_tokens" ADD CONSTRAINT "email_change_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_tokens" ADD CONSTRAINT "registration_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_applications" ADD CONSTRAINT "olympiad_applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_applications" ADD CONSTRAINT "olympiad_applications_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "olympiads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_steps" ADD CONSTRAINT "olympiad_steps_olympiad_id_fkey" FOREIGN KEY ("olympiad_id") REFERENCES "olympiads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_step_results" ADD CONSTRAINT "olympiad_step_results_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_step_results" ADD CONSTRAINT "olympiad_step_results_olympiad_step_id_fkey" FOREIGN KEY ("olympiad_step_id") REFERENCES "olympiad_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_step_attempts" ADD CONSTRAINT "olympiad_step_attempts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_step_attempts" ADD CONSTRAINT "olympiad_step_attempts_olympiad_step_id_fkey" FOREIGN KEY ("olympiad_step_id") REFERENCES "olympiad_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_tasks" ADD CONSTRAINT "olympiad_tasks_olympiad_step_id_fkey" FOREIGN KEY ("olympiad_step_id") REFERENCES "olympiad_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_task_answer_attempts" ADD CONSTRAINT "olympiad_task_answer_attempts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_task_answer_attempts" ADD CONSTRAINT "olympiad_task_answer_attempts_olympiad_step_attempt_id_fkey" FOREIGN KEY ("olympiad_step_attempt_id") REFERENCES "olympiad_step_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_task_answer_attempts" ADD CONSTRAINT "olympiad_task_answer_attempts_olympiad_task_id_fkey" FOREIGN KEY ("olympiad_task_id") REFERENCES "olympiad_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_task_answer_variants" ADD CONSTRAINT "olympiad_task_answer_variants_olympiad_task_id_fkey" FOREIGN KEY ("olympiad_task_id") REFERENCES "olympiad_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_reviews" ADD CONSTRAINT "olympiad_reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_reviews" ADD CONSTRAINT "olympiad_reviews_olympiad_id_fkey" FOREIGN KEY ("olympiad_id") REFERENCES "olympiads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses_modules" ADD CONSTRAINT "courses_modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_education_steps" ADD CONSTRAINT "course_education_steps_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_applications" ADD CONSTRAINT "course_applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_applications" ADD CONSTRAINT "course_applications_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_attendances" ADD CONSTRAINT "course_attendances_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_attendances" ADD CONSTRAINT "course_attendances_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_dislikes" ADD CONSTRAINT "article_dislikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_dislikes" ADD CONSTRAINT "article_dislikes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToTeacher" ADD CONSTRAINT "_StudentToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToTeacher" ADD CONSTRAINT "_StudentToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsToNewsTag" ADD CONSTRAINT "_NewsToNewsTag_A_fkey" FOREIGN KEY ("A") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsToNewsTag" ADD CONSTRAINT "_NewsToNewsTag_B_fkey" FOREIGN KEY ("B") REFERENCES "news_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadToStudent" ADD CONSTRAINT "_OlympiadToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "olympiads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadToStudent" ADD CONSTRAINT "_OlympiadToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadToOlympiadTag" ADD CONSTRAINT "_OlympiadToOlympiadTag_A_fkey" FOREIGN KEY ("A") REFERENCES "olympiads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadToOlympiadTag" ADD CONSTRAINT "_OlympiadToOlympiadTag_B_fkey" FOREIGN KEY ("B") REFERENCES "olympiad_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadApplicationToOlympiadStep" ADD CONSTRAINT "_OlympiadApplicationToOlympiadStep_A_fkey" FOREIGN KEY ("A") REFERENCES "olympiad_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadApplicationToOlympiadStep" ADD CONSTRAINT "_OlympiadApplicationToOlympiadStep_B_fkey" FOREIGN KEY ("B") REFERENCES "olympiad_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadTaskAnswerAttemptToOlympiadTaskAnswerVariant" ADD CONSTRAINT "_OlympiadTaskAnswerAttemptToOlympiadTaskAnswerVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "olympiad_task_answer_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadTaskAnswerAttemptToOlympiadTaskAnswerVariant" ADD CONSTRAINT "_OlympiadTaskAnswerAttemptToOlympiadTaskAnswerVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "olympiad_task_answer_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStudent" ADD CONSTRAINT "_CourseToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStudent" ADD CONSTRAINT "_CourseToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseTag" ADD CONSTRAINT "_CourseToCourseTag_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseTag" ADD CONSTRAINT "_CourseToCourseTag_B_fkey" FOREIGN KEY ("B") REFERENCES "courses_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToArticleTag" ADD CONSTRAINT "_ArticleToArticleTag_A_fkey" FOREIGN KEY ("A") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToArticleTag" ADD CONSTRAINT "_ArticleToArticleTag_B_fkey" FOREIGN KEY ("B") REFERENCES "article_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
