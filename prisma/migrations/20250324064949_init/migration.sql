/*
  Warnings:

  - The primary key for the `user_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `user_roles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "roles"."user_roles" DROP CONSTRAINT "user_roles_role_id_fkey";

-- AlterTable
ALTER TABLE "roles"."user_roles" DROP CONSTRAINT "user_roles_pkey",
DROP COLUMN "role_id",
ADD COLUMN     "role_name" TEXT NOT NULL DEFAULT '',
ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_name");

-- AddForeignKey
ALTER TABLE "roles"."user_roles" ADD CONSTRAINT "user_roles_role_name_fkey" FOREIGN KEY ("role_name") REFERENCES "roles"."roles"("role_name") ON DELETE CASCADE ON UPDATE CASCADE;
