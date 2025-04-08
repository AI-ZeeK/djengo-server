-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "communications";

-- CreateEnum
CREATE TYPE "communications"."ChatType" AS ENUM ('DIRECT', 'GROUP');

-- AlterTable
ALTER TABLE "profiles"."users" ADD COLUMN     "password" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "communications"."chats" (
    "chat_id" TEXT NOT NULL,
    "chat_type" "communications"."ChatType" NOT NULL DEFAULT 'DIRECT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "communications"."chats-participants" (
    "participant_id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "chat_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unread_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "chats-participants_pkey" PRIMARY KEY ("participant_id")
);

-- CreateTable
CREATE TABLE "communications"."message" (
    "message_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("message_id")
);

-- AddForeignKey
ALTER TABLE "communications"."chats-participants" ADD CONSTRAINT "chats-participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."chats-participants" ADD CONSTRAINT "chats-participants_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "communications"."chats"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."message" ADD CONSTRAINT "message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "communications"."chats"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications"."message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
