/*
  Warnings:

  - The primary key for the `chats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `chat_id` column on the `chats` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `chats-participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "communications"."ChatStatus" AS ENUM ('READ', 'DELIVERED', 'PENDING', 'SENT');

-- CreateEnum
CREATE TYPE "communications"."MessageType" AS ENUM ('TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'FILE', 'LOCATION');

-- CreateEnum
CREATE TYPE "communications"."MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ');

-- AlterEnum
ALTER TYPE "communications"."ChatType" ADD VALUE 'CHANNEL';

-- DropForeignKey
ALTER TABLE "communications"."chats-participants" DROP CONSTRAINT "chats-participants_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "communications"."chats-participants" DROP CONSTRAINT "chats-participants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "communications"."message" DROP CONSTRAINT "message_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "communications"."message" DROP CONSTRAINT "message_sender_id_fkey";

-- AlterTable
ALTER TABLE "communications"."chats" DROP CONSTRAINT "chats_pkey",
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "name" VARCHAR(100),
ADD COLUMN     "status" "communications"."ChatStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "chat_id",
ADD COLUMN     "chat_id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(6),
ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("chat_id");

-- DropTable
DROP TABLE "communications"."chats-participants";

-- DropTable
DROP TABLE "communications"."message";

-- CreateTable
CREATE TABLE "communications"."chat_participants" (
    "chat_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "left_at" TIMESTAMPTZ(6),

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("chat_id","user_id")
);

-- CreateTable
CREATE TABLE "communications"."messages" (
    "message_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chat_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "type" "communications"."MessageType" NOT NULL DEFAULT 'TEXT',
    "status" "communications"."MessageStatus" NOT NULL DEFAULT 'SENT',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "duration" INTEGER,
    "file_url" TEXT,
    "file_size" INTEGER,
    "file_type" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "communications"."message_reads" (
    "message_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "read_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("message_id","user_id")
);

-- CreateTable
CREATE TABLE "communications"."unread_message_counts" (
    "user_id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "last_read_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unread_message_counts_pkey" PRIMARY KEY ("user_id","chat_id")
);

-- CreateIndex
CREATE INDEX "messages_chat_id_idx" ON "communications"."messages"("chat_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_idx" ON "communications"."messages"("sender_id");

-- AddForeignKey
ALTER TABLE "communications"."chat_participants" ADD CONSTRAINT "chat_participants_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "communications"."chats"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."chat_participants" ADD CONSTRAINT "chat_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "communications"."chats"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."message_reads" ADD CONSTRAINT "message_reads_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "communications"."messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."message_reads" ADD CONSTRAINT "message_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."unread_message_counts" ADD CONSTRAINT "unread_message_counts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."unread_message_counts" ADD CONSTRAINT "unread_message_counts_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "communications"."chats"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;
