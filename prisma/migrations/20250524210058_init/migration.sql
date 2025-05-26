/*
  Warnings:

  - You are about to drop the column `creator_id` on the `business_user_roles` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `organization_roles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "roles"."business_user_roles" DROP CONSTRAINT "business_user_roles_creator_id_fkey";

-- AlterTable
ALTER TABLE "roles"."business_user_roles" DROP COLUMN "creator_id";

-- AlterTable
ALTER TABLE "roles"."organization_roles" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creator_id" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "roles"."organization_roles" ADD CONSTRAINT "organization_roles_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
