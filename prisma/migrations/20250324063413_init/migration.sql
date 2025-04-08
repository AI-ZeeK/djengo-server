/*
  Warnings:

  - A unique constraint covering the columns `[user_id,is_active]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "roles"."user_roles" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_is_active_key" ON "roles"."user_roles"("user_id", "is_active");
