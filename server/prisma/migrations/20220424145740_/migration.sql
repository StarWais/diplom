/*
  Warnings:

  - You are about to drop the column `new_email` on the `email_change_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "email_change_tokens" DROP COLUMN "new_email";
