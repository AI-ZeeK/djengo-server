/*
  Warnings:

  - The primary key for the `transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `staff_active` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the `company_roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,is_active]` on the table `staff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "organizations"."BusinessAccessType" AS ENUM ('CREATOR', 'PARTNER', 'VENDOR', 'CLIENT', 'INVESTOR');

-- CreateEnum
CREATE TYPE "financials"."BudgetStatus" AS ENUM ('PENDING', 'ACTIVE', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "financials"."AllocationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DISBURSED');

-- CreateEnum
CREATE TYPE "financials"."RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "financials"."DisbursementStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "organizations"."company_roles" DROP CONSTRAINT "company_roles_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."company_roles" DROP CONSTRAINT "company_roles_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."company_roles" DROP CONSTRAINT "company_roles_reports_to_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."staff_company_roles" DROP CONSTRAINT "staff_company_roles_company_role_id_fkey";

-- DropIndex
DROP INDEX "profiles"."staff_user_id_staff_active_key";

-- AlterTable
ALTER TABLE "financials"."transactions" DROP CONSTRAINT "transactions_pkey",
DROP COLUMN "id",
ADD COLUMN     "branch_id" UUID,
ADD COLUMN     "transaction_id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id");

-- AlterTable
ALTER TABLE "profiles"."staff" DROP COLUMN "staff_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "organizations"."company_roles";

-- CreateTable
CREATE TABLE "roles"."organization_roles" (
    "role_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "company_id" UUID,
    "branch_id" UUID,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "level_number" INTEGER NOT NULL DEFAULT 0,
    "reports_to" UUID,
    "is_org_level" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "organization_roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "roles"."user_permission_restrictions" (
    "restriction_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "permission_name" VARCHAR(50) NOT NULL,
    "restriction_type" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "reason" TEXT,
    "restricted_by" UUID NOT NULL,
    "restricted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_permission_restrictions_pkey" PRIMARY KEY ("restriction_id")
);

-- CreateTable
CREATE TABLE "profiles"."business_users" (
    "business_user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "role_id" UUID,
    "access_type" "organizations"."BusinessAccessType" NOT NULL DEFAULT 'CREATOR',
    "access_level" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "business_users_pkey" PRIMARY KEY ("business_user_id")
);

-- CreateTable
CREATE TABLE "financials"."monthly_budgets" (
    "budget_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "allocated_amount" DECIMAL(12,2) NOT NULL,
    "status" "financials"."BudgetStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_budgets_pkey" PRIMARY KEY ("budget_id")
);

-- CreateTable
CREATE TABLE "financials"."branch_budget_allocations" (
    "allocation_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "budget_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "allocated_amount" DECIMAL(12,2) NOT NULL,
    "allocated_by" UUID NOT NULL,
    "status" "financials"."AllocationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "branch_budget_allocations_pkey" PRIMARY KEY ("allocation_id")
);

-- CreateTable
CREATE TABLE "financials"."branch_fund_disbursements" (
    "disbursement_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "allocation_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" "financials"."DisbursementStatus" NOT NULL DEFAULT 'PENDING',
    "disbursed_by" UUID NOT NULL,
    "disbursed_at" TIMESTAMP(3),
    "transaction_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "branch_fund_disbursements_pkey" PRIMARY KEY ("disbursement_id")
);

-- CreateTable
CREATE TABLE "financials"."extra_fund_requests" (
    "request_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "purpose" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "status" "financials"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "requested_by" UUID NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "extra_fund_requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateIndex
CREATE INDEX "organization_roles_is_org_level_idx" ON "roles"."organization_roles"("is_org_level");

-- CreateIndex
CREATE UNIQUE INDEX "organization_roles_company_id_slug_key" ON "roles"."organization_roles"("company_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "organization_roles_company_id_branch_id_slug_key" ON "roles"."organization_roles"("company_id", "branch_id", "slug");

-- CreateIndex
CREATE INDEX "user_permission_restrictions_user_id_idx" ON "roles"."user_permission_restrictions"("user_id");

-- CreateIndex
CREATE INDEX "user_permission_restrictions_permission_name_idx" ON "roles"."user_permission_restrictions"("permission_name");

-- CreateIndex
CREATE INDEX "user_permission_restrictions_restriction_type_idx" ON "roles"."user_permission_restrictions"("restriction_type");

-- CreateIndex
CREATE UNIQUE INDEX "user_permission_restrictions_user_id_permission_name_is_act_key" ON "roles"."user_permission_restrictions"("user_id", "permission_name", "is_active");

-- CreateIndex
CREATE INDEX "business_users_user_id_idx" ON "profiles"."business_users"("user_id");

-- CreateIndex
CREATE INDEX "business_users_organization_id_idx" ON "profiles"."business_users"("organization_id");

-- CreateIndex
CREATE INDEX "business_users_role_id_idx" ON "profiles"."business_users"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_users_user_id_organization_id_key" ON "profiles"."business_users"("user_id", "organization_id");

-- CreateIndex
CREATE INDEX "monthly_budgets_organization_id_idx" ON "financials"."monthly_budgets"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_budgets_organization_id_month_year_key" ON "financials"."monthly_budgets"("organization_id", "month", "year");

-- CreateIndex
CREATE INDEX "branch_budget_allocations_budget_id_idx" ON "financials"."branch_budget_allocations"("budget_id");

-- CreateIndex
CREATE INDEX "branch_budget_allocations_branch_id_idx" ON "financials"."branch_budget_allocations"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_budget_allocations_budget_id_branch_id_key" ON "financials"."branch_budget_allocations"("budget_id", "branch_id");

-- CreateIndex
CREATE INDEX "branch_fund_disbursements_disbursed_by_idx" ON "financials"."branch_fund_disbursements"("disbursed_by");

-- CreateIndex
CREATE INDEX "extra_fund_requests_branch_id_idx" ON "financials"."extra_fund_requests"("branch_id");

-- CreateIndex
CREATE INDEX "extra_fund_requests_approved_by_idx" ON "financials"."extra_fund_requests"("approved_by");

-- CreateIndex
CREATE UNIQUE INDEX "staff_user_id_is_active_key" ON "profiles"."staff"("user_id", "is_active");

-- AddForeignKey
ALTER TABLE "roles"."organization_roles" ADD CONSTRAINT "organization_roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"."organizations"("organization_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."organization_roles" ADD CONSTRAINT "organization_roles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."organization_roles" ADD CONSTRAINT "organization_roles_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."organization_roles" ADD CONSTRAINT "organization_roles_reports_to_fkey" FOREIGN KEY ("reports_to") REFERENCES "roles"."organization_roles"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."user_permission_restrictions" ADD CONSTRAINT "user_permission_restrictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."user_permission_restrictions" ADD CONSTRAINT "user_permission_restrictions_restricted_by_fkey" FOREIGN KEY ("restricted_by") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."business_users" ADD CONSTRAINT "business_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."business_users" ADD CONSTRAINT "business_users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"."organizations"("organization_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."business_users" ADD CONSTRAINT "business_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"."organization_roles"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_company_roles" ADD CONSTRAINT "staff_company_roles_company_role_id_fkey" FOREIGN KEY ("company_role_id") REFERENCES "roles"."organization_roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."transactions" ADD CONSTRAINT "transactions_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financials"."monthly_budgets" ADD CONSTRAINT "monthly_budgets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"."organizations"("organization_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."monthly_budgets" ADD CONSTRAINT "monthly_budgets_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "profiles"."users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."branch_budget_allocations" ADD CONSTRAINT "branch_budget_allocations_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "financials"."monthly_budgets"("budget_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."branch_budget_allocations" ADD CONSTRAINT "branch_budget_allocations_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."branch_budget_allocations" ADD CONSTRAINT "branch_budget_allocations_allocated_by_fkey" FOREIGN KEY ("allocated_by") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."branch_fund_disbursements" ADD CONSTRAINT "branch_fund_disbursements_allocation_id_fkey" FOREIGN KEY ("allocation_id") REFERENCES "financials"."branch_budget_allocations"("allocation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."branch_fund_disbursements" ADD CONSTRAINT "branch_fund_disbursements_disbursed_by_fkey" FOREIGN KEY ("disbursed_by") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."branch_fund_disbursements" ADD CONSTRAINT "branch_fund_disbursements_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "financials"."transactions"("transaction_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."extra_fund_requests" ADD CONSTRAINT "extra_fund_requests_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."extra_fund_requests" ADD CONSTRAINT "extra_fund_requests_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "profiles"."users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."extra_fund_requests" ADD CONSTRAINT "extra_fund_requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
