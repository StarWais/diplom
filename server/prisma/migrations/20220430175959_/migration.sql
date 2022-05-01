-- CreateTable
CREATE TABLE "news_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NewsToNewsTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "news_tags_name_key" ON "news_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_NewsToNewsTag_AB_unique" ON "_NewsToNewsTag"("A", "B");

-- CreateIndex
CREATE INDEX "_NewsToNewsTag_B_index" ON "_NewsToNewsTag"("B");

-- AddForeignKey
ALTER TABLE "_NewsToNewsTag" ADD CONSTRAINT "_NewsToNewsTag_A_fkey" FOREIGN KEY ("A") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsToNewsTag" ADD CONSTRAINT "_NewsToNewsTag_B_fkey" FOREIGN KEY ("B") REFERENCES "news_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
