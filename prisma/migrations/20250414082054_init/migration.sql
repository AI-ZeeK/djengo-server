/*
  Warnings:

  - The values [READ] on the enum `MessageStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_read` on the `message_reads` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "communications"."MessageStatus_new" AS ENUM ('PENDING', 'SENT', 'DELIVERED');
ALTER TABLE "communications"."messages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "communications"."messages" ALTER COLUMN "status" TYPE "communications"."MessageStatus_new" USING ("status"::text::"communications"."MessageStatus_new");
ALTER TYPE "communications"."MessageStatus" RENAME TO "MessageStatus_old";
ALTER TYPE "communications"."MessageStatus_new" RENAME TO "MessageStatus";
DROP TYPE "communications"."MessageStatus_old";
ALTER TABLE "communications"."messages" ALTER COLUMN "status" SET DEFAULT 'SENT';
COMMIT;

-- AlterTable
ALTER TABLE "communications"."message_reads" DROP COLUMN "is_read";
