/*
  Warnings:

  - You are about to drop the column `table_type_name` on the `table_types` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `business_users` table. All the data in the column will be lost.
  - Added the required column `name` to the `table_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "profiles"."business_users" DROP CONSTRAINT "business_users_role_id_fkey";

-- DropIndex
DROP INDEX "profiles"."business_users_role_id_idx";

-- AlterTable
ALTER TABLE "organizations"."table_types" DROP COLUMN "table_type_name",
ADD COLUMN     "name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "profiles"."business_users" DROP COLUMN "role_id";

-- CreateTable
CREATE TABLE "roles"."business_user_roles" (
    "business_user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "business_user_roles_pkey" PRIMARY KEY ("business_user_id")
);

-- AddForeignKey
ALTER TABLE "roles"."business_user_roles" ADD CONSTRAINT "business_user_roles_business_user_id_fkey" FOREIGN KEY ("business_user_id") REFERENCES "profiles"."business_users"("business_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."business_user_roles" ADD CONSTRAINT "business_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"."organization_roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;
