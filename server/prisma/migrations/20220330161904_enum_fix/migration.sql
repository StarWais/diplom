/*
  Warnings:

  - The values [EXPIRED] on the enum `TokenStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TokenStatus_new" AS ENUM ('PENDING', 'FULFILLED');
ALTER TABLE "password_reset_tokens" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "registration_tokens" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "password_reset_tokens" ALTER COLUMN "status" TYPE "TokenStatus_new" USING ("status"::text::"TokenStatus_new");
ALTER TABLE "registration_tokens" ALTER COLUMN "status" TYPE "TokenStatus_new" USING ("status"::text::"TokenStatus_new");
ALTER TYPE "TokenStatus" RENAME TO "TokenStatus_old";
ALTER TYPE "TokenStatus_new" RENAME TO "TokenStatus";
DROP TYPE "TokenStatus_old";
ALTER TABLE "password_reset_tokens" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "registration_tokens" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
