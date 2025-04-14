-- AlterTable
ALTER TABLE "communications"."chat_participants" ADD COLUMN     "unread_count" INTEGER NOT NULL DEFAULT 0;
