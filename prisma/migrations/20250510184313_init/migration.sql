/*
  Warnings:

  - You are about to drop the column `branch_name` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `company_roles` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `company_roles` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `company_roles` table. All the data in the column will be lost.
  - You are about to drop the column `department_name` on the `departments` table. All the data in the column will be lost.
  - You are about to drop the column `hotel_name` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the column `branch_id` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `restaurant_name` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `date_joined` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the `_BranchToRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompanyRoleToStaff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff_payment_information` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff_probation_info` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `branches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `branches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,slug]` on the table `company_roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,branch_id,slug]` on the table `company_roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,name]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,staff_active]` on the table `staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Made the column `is_active` on table `branches` required. This step will fail if there are existing NULL values in that column.
  - Made the column `multi_branch` on table `company_meta_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `has_hotel` on table `company_meta_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `has_restaurant` on table `company_meta_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `has_supermarket` on table `company_meta_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `has_hospital` on table `company_meta_data` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `departments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `hotels` table without a default value. This is not possible if the table is not empty.
  - Made the column `is_active` on table `hotels` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Made the column `is_active` on table `restaurants` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `branch_id` to the `staff` table without a default value. This is not possible if the table is not empty.
  - Made the column `company_id` on table `staff` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "profiles"."AccountType" AS ENUM ('ORGANIZATION', 'INDIVIDUAL');

-- DropForeignKey
ALTER TABLE "financials"."global_reports" DROP CONSTRAINT "global_reports_company_id_fkey";

-- DropForeignKey
ALTER TABLE "financials"."payroll_schedule" DROP CONSTRAINT "payroll_schedule_company_id_fkey";

-- DropForeignKey
ALTER TABLE "financials"."transactions" DROP CONSTRAINT "transactions_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."_BranchToRoom" DROP CONSTRAINT "_BranchToRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."_BranchToRoom" DROP CONSTRAINT "_BranchToRoom_B_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."_CompanyRoleToStaff" DROP CONSTRAINT "_CompanyRoleToStaff_A_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."_CompanyRoleToStaff" DROP CONSTRAINT "_CompanyRoleToStaff_B_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."branches" DROP CONSTRAINT "branches_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."branches" DROP CONSTRAINT "branches_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."branches" DROP CONSTRAINT "branches_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."business_hours" DROP CONSTRAINT "business_hours_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."calendar_events" DROP CONSTRAINT "calendar_events_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."company_meta_data" DROP CONSTRAINT "company_meta_data_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."company_roles" DROP CONSTRAINT "company_roles_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."company_roles" DROP CONSTRAINT "company_roles_department_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."departments" DROP CONSTRAINT "departments_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."hotels" DROP CONSTRAINT "hotels_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."reservations" DROP CONSTRAINT "reservations_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."restaurants" DROP CONSTRAINT "restaurants_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."user_companies" DROP CONSTRAINT "user_companies_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."user_companies" DROP CONSTRAINT "user_companies_user_id_fkey";

-- DropForeignKey
ALTER TABLE "profiles"."staff" DROP CONSTRAINT "staff_company_id_fkey";

-- DropForeignKey
ALTER TABLE "profiles"."staff_payment_information" DROP CONSTRAINT "staff_payment_information_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "profiles"."staff_probation_info" DROP CONSTRAINT "staff_probation_info_staff_id_fkey";

-- DropIndex
DROP INDEX "organizations"."company_roles_company_id_slug_branch_id_department_id_key";

-- DropIndex
DROP INDEX "organizations"."departments_company_id_department_name_key";

-- AlterTable
ALTER TABLE "organizations"."branches" DROP COLUMN "branch_name",
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "phone_number" VARCHAR(20),
ALTER COLUMN "is_active" SET NOT NULL;

-- AlterTable
ALTER TABLE "organizations"."company_meta_data" ALTER COLUMN "multi_branch" SET NOT NULL,
ALTER COLUMN "has_hotel" SET NOT NULL,
ALTER COLUMN "has_restaurant" SET NOT NULL,
ALTER COLUMN "has_supermarket" SET NOT NULL,
ALTER COLUMN "has_hospital" SET NOT NULL;

-- AlterTable
ALTER TABLE "organizations"."company_roles" DROP COLUMN "created_at",
DROP COLUMN "department_id",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "organizations"."departments" DROP COLUMN "department_name",
ADD COLUMN     "branch_id" UUID,
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "organizations"."hotels" DROP COLUMN "hotel_name",
ADD COLUMN     "branch_id" UUID,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL;

-- AlterTable
ALTER TABLE "organizations"."reservations" DROP COLUMN "branch_id";

-- AlterTable
ALTER TABLE "organizations"."restaurants" DROP COLUMN "restaurant_name",
ADD COLUMN     "branch_id" UUID,
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL;

-- AlterTable
ALTER TABLE "organizations"."rooms" ADD COLUMN     "deleted_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "profiles"."staff" DROP COLUMN "date_joined",
ADD COLUMN     "branch_id" UUID NOT NULL,
ALTER COLUMN "company_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "profiles"."users" ADD COLUMN     "account_type" "profiles"."AccountType" NOT NULL DEFAULT 'INDIVIDUAL',
ADD COLUMN     "permission_level" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "organizations"."_BranchToRoom";

-- DropTable
DROP TABLE "organizations"."_CompanyRoleToStaff";

-- DropTable
DROP TABLE "organizations"."company";

-- DropTable
DROP TABLE "organizations"."user_companies";

-- DropTable
DROP TABLE "profiles"."staff_payment_information";

-- DropTable
DROP TABLE "profiles"."staff_probation_info";

-- DropEnum
DROP TYPE "organizations"."CompanyStatus";

-- CreateTable
CREATE TABLE "organizations"."organizations" (
    "organization_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20),
    "registration_number" VARCHAR(50),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("organization_id")
);

-- CreateTable
CREATE TABLE "organizations"."companies" (
    "company_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "company_ref" VARCHAR(255),
    "company_name" VARCHAR(50),
    "email" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "registeration_date" TIMESTAMPTZ(6),
    "registration_number" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "organizations"."staff_company_roles" (
    "staff_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_role_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "staff_company_roles_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "organizations"."department_roles" (
    "role_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "level_number" INTEGER NOT NULL DEFAULT 0,
    "reports_to" UUID,

    CONSTRAINT "department_roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "organizations"."staff_department_roles" (
    "staff_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "department_role_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "staff_department_roles_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "roles"."permissions" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" VARCHAR(50),
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "roles"."entity_permissions" (
    "entity_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entity_type" VARCHAR(20) NOT NULL,
    "role_id" INTEGER,
    "user_id" UUID,
    "permission_id" INTEGER NOT NULL,
    "is_granted" BOOLEAN NOT NULL DEFAULT true,
    "granted_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "granted_by_user_id" UUID,
    "level" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "entity_permissions_pkey" PRIMARY KEY ("entity_id")
);

-- CreateTable
CREATE TABLE "roles"."permission_groups" (
    "permission_group_id" SERIAL NOT NULL,
    "group_name" VARCHAR(50),
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_groups_pkey" PRIMARY KEY ("permission_group_id")
);

-- CreateTable
CREATE TABLE "roles"."permission_group_permissions" (
    "permission_group_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "permission_group_permissions_pkey" PRIMARY KEY ("permission_group_id","permission_id")
);

-- CreateTable
CREATE TABLE "organizations"."organization_access" (
    "access_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "permission_level" DECIMAL(3,1) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "organization_access_pkey" PRIMARY KEY ("access_id")
);

-- CreateTable
CREATE TABLE "organizations"."_UserCalendarEvents" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserCalendarEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_email_key" ON "organizations"."organizations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_phone_number_key" ON "organizations"."organizations"("phone_number");

-- CreateIndex
CREATE INDEX "idx_organizations_email" ON "organizations"."organizations"("email");

-- CreateIndex
CREATE INDEX "idx_organizations_phone_number" ON "organizations"."organizations"("phone_number");

-- CreateIndex
CREATE INDEX "idx_organizations_created_by" ON "organizations"."organizations"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_ref_key" ON "organizations"."companies"("company_ref");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "organizations"."companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_phone_number_key" ON "organizations"."companies"("phone_number");

-- CreateIndex
CREATE INDEX "companies_organization_id_idx" ON "organizations"."companies"("organization_id");

-- CreateIndex
CREATE INDEX "companies_email_idx" ON "organizations"."companies"("email");

-- CreateIndex
CREATE INDEX "companies_phone_number_idx" ON "organizations"."companies"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "staff_company_roles_staff_id_company_role_id_is_active_key" ON "organizations"."staff_company_roles"("staff_id", "company_role_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "department_roles_company_id_branch_id_department_id_slug_key" ON "organizations"."department_roles"("company_id", "branch_id", "department_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "staff_department_roles_staff_id_department_role_id_is_activ_key" ON "organizations"."staff_department_roles"("staff_id", "department_role_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "idx_permissions_permission_name" ON "roles"."permissions"("permission_name");

-- CreateIndex
CREATE INDEX "idx_entity_permissions_granted_by" ON "roles"."entity_permissions"("granted_by_user_id");

-- CreateIndex
CREATE INDEX "idx_entity_permissions_permission_id" ON "roles"."entity_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "entity_permissions_entity_id_entity_type_permission_id_key" ON "roles"."entity_permissions"("entity_id", "entity_type", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_permission_groups_group_name" ON "roles"."permission_groups"("group_name");

-- CreateIndex
CREATE INDEX "permission_group_permissions_permission_id_idx" ON "roles"."permission_group_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "organization_access_user_id_idx" ON "organizations"."organization_access"("user_id");

-- CreateIndex
CREATE INDEX "organization_access_organization_id_idx" ON "organizations"."organization_access"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_access_organization_id_user_id_key" ON "organizations"."organization_access"("organization_id", "user_id");

-- CreateIndex
CREATE INDEX "_UserCalendarEvents_B_index" ON "organizations"."_UserCalendarEvents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "branches_email_key" ON "organizations"."branches"("email");

-- CreateIndex
CREATE UNIQUE INDEX "branches_phone_number_key" ON "organizations"."branches"("phone_number");

-- CreateIndex
CREATE INDEX "branches_company_id_idx" ON "organizations"."branches"("company_id");

-- CreateIndex
CREATE INDEX "branches_email_idx" ON "organizations"."branches"("email");

-- CreateIndex
CREATE INDEX "branches_phone_number_idx" ON "organizations"."branches"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "company_roles_company_id_slug_key" ON "organizations"."company_roles"("company_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "company_roles_company_id_branch_id_slug_key" ON "organizations"."company_roles"("company_id", "branch_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "departments_company_id_name_key" ON "organizations"."departments"("company_id", "name");

-- CreateIndex
CREATE INDEX "hotels_company_id_idx" ON "organizations"."hotels"("company_id");

-- CreateIndex
CREATE INDEX "restaurants_company_id_idx" ON "organizations"."restaurants"("company_id");

-- CreateIndex
CREATE INDEX "staff_company_id_idx" ON "profiles"."staff"("company_id");

-- CreateIndex
CREATE INDEX "staff_branch_id_idx" ON "profiles"."staff"("branch_id");

-- CreateIndex
CREATE INDEX "staff_user_id_idx" ON "profiles"."staff"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_user_id_staff_active_key" ON "profiles"."staff"("user_id", "staff_active");

-- AddForeignKey
ALTER TABLE "organizations"."organizations" ADD CONSTRAINT "organizations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."companies" ADD CONSTRAINT "companies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"."organizations"("organization_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."branches" ADD CONSTRAINT "branches_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."staff" ADD CONSTRAINT "staff_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."staff" ADD CONSTRAINT "staff_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."departments" ADD CONSTRAINT "departments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."departments" ADD CONSTRAINT "departments_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."business_hours" ADD CONSTRAINT "business_hours_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company_meta_data" ADD CONSTRAINT "company_meta_data_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company_roles" ADD CONSTRAINT "company_roles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_company_roles" ADD CONSTRAINT "staff_company_roles_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "profiles"."staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_company_roles" ADD CONSTRAINT "staff_company_roles_company_role_id_fkey" FOREIGN KEY ("company_role_id") REFERENCES "organizations"."company_roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."department_roles" ADD CONSTRAINT "department_roles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."department_roles" ADD CONSTRAINT "department_roles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "organizations"."departments"("department_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."department_roles" ADD CONSTRAINT "department_roles_reports_to_fkey" FOREIGN KEY ("reports_to") REFERENCES "organizations"."department_roles"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_department_roles" ADD CONSTRAINT "staff_department_roles_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "profiles"."staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_department_roles" ADD CONSTRAINT "staff_department_roles_department_role_id_fkey" FOREIGN KEY ("department_role_id") REFERENCES "organizations"."department_roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."calendar_events" ADD CONSTRAINT "calendar_events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."global_reports" ADD CONSTRAINT "global_reports_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."restaurants" ADD CONSTRAINT "restaurants_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."restaurants" ADD CONSTRAINT "restaurants_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."payroll_schedule" ADD CONSTRAINT "payroll_schedule_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."transactions" ADD CONSTRAINT "transactions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles"."entity_permissions" ADD CONSTRAINT "entity_permissions_granted_by_user_id_fkey" FOREIGN KEY ("granted_by_user_id") REFERENCES "profiles"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles"."entity_permissions" ADD CONSTRAINT "entity_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "roles"."permissions"("permission_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles"."entity_permissions" ADD CONSTRAINT "entity_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"."roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles"."entity_permissions" ADD CONSTRAINT "entity_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles"."permission_group_permissions" ADD CONSTRAINT "permission_group_permissions_permission_group_id_fkey" FOREIGN KEY ("permission_group_id") REFERENCES "roles"."permission_groups"("permission_group_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles"."permission_group_permissions" ADD CONSTRAINT "permission_group_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "roles"."permissions"("permission_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations"."hotels" ADD CONSTRAINT "hotels_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."hotels" ADD CONSTRAINT "hotels_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."organization_access" ADD CONSTRAINT "organization_access_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"."organizations"("organization_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."organization_access" ADD CONSTRAINT "organization_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_UserCalendarEvents" ADD CONSTRAINT "_UserCalendarEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"."calendar_events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_UserCalendarEvents" ADD CONSTRAINT "_UserCalendarEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
