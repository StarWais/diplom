/*
  Warnings:

  - Added the required column `expires_in` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_in` to the `registration_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "password_reset_tokens" ADD COLUMN     "expires_in" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "registration_tokens" ADD COLUMN     "expires_in" TIMESTAMP(3) NOT NULL;
