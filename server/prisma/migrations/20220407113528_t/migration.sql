-- CreateTable
CREATE TABLE "courses_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToCourseTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_tags_name_key" ON "courses_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToCourseTag_AB_unique" ON "_CourseToCourseTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToCourseTag_B_index" ON "_CourseToCourseTag"("B");

-- AddForeignKey
ALTER TABLE "_CourseToCourseTag" ADD FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseTag" ADD FOREIGN KEY ("B") REFERENCES "courses_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
