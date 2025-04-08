/*
  Warnings:

  - You are about to drop the column `status` on the `verifications` table. All the data in the column will be lost.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "profiles"."users" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "profiles"."verifications" DROP COLUMN "status";

-- DropEnum
DROP TYPE "profiles"."VerificationStatus";
