/*
  Warnings:

  - You are about to drop the column `user_id` on the `company` table. All the data in the column will be lost.
  - You are about to drop the `branch_access` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "organizations"."company" DROP CONSTRAINT "company_user_id_fkey";

-- DropForeignKey
ALTER TABLE "roles"."branch_access" DROP CONSTRAINT "branch_access_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "roles"."branch_access" DROP CONSTRAINT "branch_access_company_id_fkey";

-- DropForeignKey
ALTER TABLE "roles"."branch_access" DROP CONSTRAINT "branch_access_user_id_fkey";

-- AlterTable
ALTER TABLE "organizations"."company" DROP COLUMN "user_id";

-- DropTable
DROP TABLE "roles"."branch_access";

-- DropEnum
DROP TYPE "roles"."AccessLevel";

-- CreateTable
CREATE TABLE "organizations"."user_companies" (
    "user_company_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_companies_pkey" PRIMARY KEY ("user_company_id")
);

-- CreateTable
CREATE TABLE "organizations"."company_roles" (
    "role_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "branch_id" UUID,
    "department_id" UUID,
    "level_number" INTEGER NOT NULL DEFAULT 0,
    "reports_to" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "organizations"."_CompanyRoleToStaff" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CompanyRoleToStaff_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_companies_user_id_company_id_key" ON "organizations"."user_companies"("user_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_roles_company_id_slug_branch_id_department_id_key" ON "organizations"."company_roles"("company_id", "slug", "branch_id", "department_id");

-- CreateIndex
CREATE INDEX "_CompanyRoleToStaff_B_index" ON "organizations"."_CompanyRoleToStaff"("B");

-- AddForeignKey
ALTER TABLE "organizations"."user_companies" ADD CONSTRAINT "user_companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."user_companies" ADD CONSTRAINT "user_companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company_roles" ADD CONSTRAINT "company_roles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company_roles" ADD CONSTRAINT "company_roles_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company_roles" ADD CONSTRAINT "company_roles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "organizations"."departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company_roles" ADD CONSTRAINT "company_roles_reports_to_fkey" FOREIGN KEY ("reports_to") REFERENCES "organizations"."company_roles"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_CompanyRoleToStaff" ADD CONSTRAINT "_CompanyRoleToStaff_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"."company_roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_CompanyRoleToStaff" ADD CONSTRAINT "_CompanyRoleToStaff_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"."staff"("staff_id") ON DELETE CASCADE ON UPDATE CASCADE;
