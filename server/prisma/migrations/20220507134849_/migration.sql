-- CreateTable
CREATE TABLE "olympiad_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olympiad_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OlympiadToOlympiadTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "olympiad_tags_name_key" ON "olympiad_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_OlympiadToOlympiadTag_AB_unique" ON "_OlympiadToOlympiadTag"("A", "B");

-- CreateIndex
CREATE INDEX "_OlympiadToOlympiadTag_B_index" ON "_OlympiadToOlympiadTag"("B");

-- AddForeignKey
ALTER TABLE "_OlympiadToOlympiadTag" ADD CONSTRAINT "_OlympiadToOlympiadTag_A_fkey" FOREIGN KEY ("A") REFERENCES "olympiads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadToOlympiadTag" ADD CONSTRAINT "_OlympiadToOlympiadTag_B_fkey" FOREIGN KEY ("B") REFERENCES "olympiad_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
