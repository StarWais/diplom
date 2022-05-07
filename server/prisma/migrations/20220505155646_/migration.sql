/*
  Warnings:

  - You are about to drop the column `steps` on the `olympiad_applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "olympiad_applications" DROP COLUMN "steps";

-- CreateTable
CREATE TABLE "_OlympiadApplicationToOlympiadStep" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OlympiadApplicationToOlympiadStep_AB_unique" ON "_OlympiadApplicationToOlympiadStep"("A", "B");

-- CreateIndex
CREATE INDEX "_OlympiadApplicationToOlympiadStep_B_index" ON "_OlympiadApplicationToOlympiadStep"("B");

-- AddForeignKey
ALTER TABLE "_OlympiadApplicationToOlympiadStep" ADD CONSTRAINT "_OlympiadApplicationToOlympiadStep_A_fkey" FOREIGN KEY ("A") REFERENCES "olympiad_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympiadApplicationToOlympiadStep" ADD CONSTRAINT "_OlympiadApplicationToOlympiadStep_B_fkey" FOREIGN KEY ("B") REFERENCES "olympiad_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
