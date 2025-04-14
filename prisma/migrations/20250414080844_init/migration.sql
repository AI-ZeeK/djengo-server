-- AlterTable
ALTER TABLE "communications"."message_reads" ADD COLUMN     "is_read" BOOLEAN DEFAULT false,
ALTER COLUMN "read_at" DROP NOT NULL,
ALTER COLUMN "read_at" DROP DEFAULT;
