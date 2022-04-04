/*
  Warnings:

  - You are about to drop the column `article_id` on the `article_tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "article_tags" DROP CONSTRAINT "article_tags_article_id_fkey";

-- AlterTable
ALTER TABLE "article_tags" DROP COLUMN "article_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "canPublish" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_ArticleToArticleTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToArticleTag_AB_unique" ON "_ArticleToArticleTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToArticleTag_B_index" ON "_ArticleToArticleTag"("B");

-- AddForeignKey
ALTER TABLE "_ArticleToArticleTag" ADD FOREIGN KEY ("A") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToArticleTag" ADD FOREIGN KEY ("B") REFERENCES "article_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
