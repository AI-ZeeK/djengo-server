/*
  Warnings:

  - Added the required column `creator_id` to the `business_user_roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roles"."business_user_roles" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creator_id" UUID NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6);

-- AddForeignKey
ALTER TABLE "roles"."business_user_roles" ADD CONSTRAINT "business_user_roles_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
