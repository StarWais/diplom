/*
  Warnings:

  - Added the required column `new_email` to the `email_change_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_change_tokens" ADD COLUMN     "new_email" TEXT NOT NULL;
