/*
  Warnings:

  - You are about to drop the `_UserCalendarEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "organizations"."TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "organizations"."TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "organizations"."TaskType" AS ENUM ('PERSONAL', 'ASSIGNED', 'TEAM', 'PROJECT', 'FOLLOW_UP', 'OTHER');

-- CreateEnum
CREATE TYPE "organizations"."EventCategory" AS ENUM ('STAFF_ATTENDANCE', 'STAFF_BREAK', 'STAFF_LEAVE', 'BUSINESS_HOURS');

-- CreateEnum
CREATE TYPE "organizations"."CustomerEventCategory" AS ENUM ('CHECKIN', 'CHECKOUT', 'RESERVATION');

-- CreateEnum
CREATE TYPE "organizations"."EventStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "organizations"."ActivityType" AS ENUM ('ORDER_COMPLETED', 'ORDER_CANCELLED', 'ORDER_REFUNDED', 'FUND_DISBURSED', 'FUND_ALLOCATION_REQUESTED', 'FUND_ALLOCATION_APPROVED', 'FUND_ALLOCATION_REJECTED', 'EXTRA_FUND_REQUESTED', 'EXTRA_FUND_APPROVED', 'EXTRA_FUND_REJECTED', 'STAFF_HIRED', 'STAFF_TERMINATED', 'STAFF_PROMOTED', 'STAFF_TRANSFERRED', 'PAYROLL_PROCESSED', 'PAYROLL_COMPLETED', 'PAYROLL_FAILED', 'INVENTORY_UPDATED', 'INVENTORY_LOW', 'INVENTORY_OUT_OF_STOCK', 'CUSTOMER_CHECKIN', 'CUSTOMER_CHECKOUT', 'RESERVATION_CREATED', 'RESERVATION_CANCELLED', 'RESERVATION_COMPLETED', 'SYSTEM_NOTIFICATION', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "organizations"."EventType" ADD VALUE 'ORDER_CREATED';
ALTER TYPE "organizations"."EventType" ADD VALUE 'ORDER_UPDATED';
ALTER TYPE "organizations"."EventType" ADD VALUE 'ORDER_COMPLETED';
ALTER TYPE "organizations"."EventType" ADD VALUE 'PAYMENT_RECEIVED';
ALTER TYPE "organizations"."EventType" ADD VALUE 'PAYMENT_DUE';
ALTER TYPE "organizations"."EventType" ADD VALUE 'INVOICE_GENERATED';
ALTER TYPE "organizations"."EventType" ADD VALUE 'INVOICE_DUE';
ALTER TYPE "organizations"."EventType" ADD VALUE 'SYSTEM_NOTIFICATION';

-- DropForeignKey
ALTER TABLE "organizations"."_UserCalendarEvents" DROP CONSTRAINT "_UserCalendarEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."_UserCalendarEvents" DROP CONSTRAINT "_UserCalendarEvents_B_fkey";

-- AlterTable
ALTER TABLE "organizations"."calendar_events" ADD COLUMN     "notification_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "system_event_data" JSONB,
ADD COLUMN     "system_event_id" UUID,
ADD COLUMN     "system_event_type" VARCHAR(50),
ADD COLUMN     "task_id" UUID;

-- DropTable
DROP TABLE "organizations"."_UserCalendarEvents";

-- CreateTable
CREATE TABLE "organizations"."tasks" (
    "task_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" "organizations"."TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "organizations"."TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "type" "organizations"."TaskType" NOT NULL DEFAULT 'PERSONAL',
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "assigned_by_id" UUID NOT NULL,
    "assigned_to_id" UUID NOT NULL,
    "company_id" UUID,
    "department_id" UUID,
    "project_id" UUID,
    "estimated_hours" INTEGER,
    "actual_hours" INTEGER,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence_rule" VARCHAR(255),
    "parent_task_id" UUID,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "organizations"."task_comments" (
    "comment_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "task_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "task_comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "organizations"."task_attachments" (
    "attachment_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "task_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "task_attachments_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "organizations"."staff_events" (
    "event_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category" "organizations"."EventCategory" NOT NULL,
    "status" "organizations"."EventStatus" NOT NULL DEFAULT 'SCHEDULED',
    "staff_id" UUID NOT NULL,
    "scheduled_start" TIMESTAMPTZ(6) NOT NULL,
    "scheduled_end" TIMESTAMPTZ(6),
    "actual_start" TIMESTAMPTZ(6),
    "actual_end" TIMESTAMPTZ(6),
    "company_id" UUID NOT NULL,
    "branch_id" UUID,
    "department_id" UUID,
    "notes" TEXT,
    "metadata" JSONB,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "staff_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "organizations"."daily_events" (
    "event_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category" "organizations"."CustomerEventCategory" NOT NULL,
    "status" "organizations"."EventStatus" NOT NULL DEFAULT 'SCHEDULED',
    "customer_id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "scheduled_start" TIMESTAMPTZ(6) NOT NULL,
    "scheduled_end" TIMESTAMPTZ(6),
    "actual_start" TIMESTAMPTZ(6),
    "actual_end" TIMESTAMPTZ(6),
    "company_id" UUID NOT NULL,
    "branch_id" UUID,
    "notes" TEXT,
    "metadata" JSONB,
    "checkout_status" VARCHAR(50),
    "total_amount" DECIMAL(12,2),
    "payment_status" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "daily_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "organizations"."activity_logs" (
    "activity_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "activity_type" "organizations"."ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "branch_id" UUID,
    "department_id" UUID,
    "performed_by_id" UUID NOT NULL,
    "performed_by_type" VARCHAR(50) NOT NULL,
    "metadata" JSONB,
    "severity" VARCHAR(20) NOT NULL DEFAULT 'INFO',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "organizations"."_user_calendar_events" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_user_calendar_events_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "tasks_assigned_by_id_idx" ON "organizations"."tasks"("assigned_by_id");

-- CreateIndex
CREATE INDEX "tasks_assigned_to_id_idx" ON "organizations"."tasks"("assigned_to_id");

-- CreateIndex
CREATE INDEX "tasks_company_id_idx" ON "organizations"."tasks"("company_id");

-- CreateIndex
CREATE INDEX "tasks_department_id_idx" ON "organizations"."tasks"("department_id");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "organizations"."tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_priority_idx" ON "organizations"."tasks"("priority");

-- CreateIndex
CREATE INDEX "tasks_type_idx" ON "organizations"."tasks"("type");

-- CreateIndex
CREATE INDEX "task_comments_task_id_idx" ON "organizations"."task_comments"("task_id");

-- CreateIndex
CREATE INDEX "task_comments_user_id_idx" ON "organizations"."task_comments"("user_id");

-- CreateIndex
CREATE INDEX "task_attachments_task_id_idx" ON "organizations"."task_attachments"("task_id");

-- CreateIndex
CREATE INDEX "task_attachments_file_id_idx" ON "organizations"."task_attachments"("file_id");

-- CreateIndex
CREATE INDEX "staff_events_staff_id_idx" ON "organizations"."staff_events"("staff_id");

-- CreateIndex
CREATE INDEX "staff_events_company_id_idx" ON "organizations"."staff_events"("company_id");

-- CreateIndex
CREATE INDEX "staff_events_branch_id_idx" ON "organizations"."staff_events"("branch_id");

-- CreateIndex
CREATE INDEX "staff_events_department_id_idx" ON "organizations"."staff_events"("department_id");

-- CreateIndex
CREATE INDEX "staff_events_scheduled_start_idx" ON "organizations"."staff_events"("scheduled_start");

-- CreateIndex
CREATE INDEX "staff_events_category_idx" ON "organizations"."staff_events"("category");

-- CreateIndex
CREATE INDEX "staff_events_status_idx" ON "organizations"."staff_events"("status");

-- CreateIndex
CREATE INDEX "daily_events_customer_id_idx" ON "organizations"."daily_events"("customer_id");

-- CreateIndex
CREATE INDEX "daily_events_company_id_idx" ON "organizations"."daily_events"("company_id");

-- CreateIndex
CREATE INDEX "daily_events_branch_id_idx" ON "organizations"."daily_events"("branch_id");

-- CreateIndex
CREATE INDEX "daily_events_scheduled_start_idx" ON "organizations"."daily_events"("scheduled_start");

-- CreateIndex
CREATE INDEX "daily_events_category_idx" ON "organizations"."daily_events"("category");

-- CreateIndex
CREATE INDEX "daily_events_status_idx" ON "organizations"."daily_events"("status");

-- CreateIndex
CREATE INDEX "activity_logs_company_id_idx" ON "organizations"."activity_logs"("company_id");

-- CreateIndex
CREATE INDEX "activity_logs_branch_id_idx" ON "organizations"."activity_logs"("branch_id");

-- CreateIndex
CREATE INDEX "activity_logs_department_id_idx" ON "organizations"."activity_logs"("department_id");

-- CreateIndex
CREATE INDEX "activity_logs_performed_by_id_idx" ON "organizations"."activity_logs"("performed_by_id");

-- CreateIndex
CREATE INDEX "activity_logs_activity_type_idx" ON "organizations"."activity_logs"("activity_type");

-- CreateIndex
CREATE INDEX "activity_logs_entity_type_entity_id_idx" ON "organizations"."activity_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "activity_logs_created_at_idx" ON "organizations"."activity_logs"("created_at");

-- CreateIndex
CREATE INDEX "_user_calendar_events_B_index" ON "organizations"."_user_calendar_events"("B");

-- CreateIndex
CREATE INDEX "calendar_events_system_event_id_idx" ON "organizations"."calendar_events"("system_event_id");

-- CreateIndex
CREATE INDEX "calendar_events_system_event_type_idx" ON "organizations"."calendar_events"("system_event_type");

-- AddForeignKey
ALTER TABLE "organizations"."calendar_events" ADD CONSTRAINT "calendar_events_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "organizations"."tasks"("task_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."tasks" ADD CONSTRAINT "tasks_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."tasks" ADD CONSTRAINT "tasks_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."tasks" ADD CONSTRAINT "tasks_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."tasks" ADD CONSTRAINT "tasks_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "organizations"."departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."tasks" ADD CONSTRAINT "tasks_parent_task_id_fkey" FOREIGN KEY ("parent_task_id") REFERENCES "organizations"."tasks"("task_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."task_comments" ADD CONSTRAINT "task_comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "organizations"."tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."task_comments" ADD CONSTRAINT "task_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."task_attachments" ADD CONSTRAINT "task_attachments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "organizations"."tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."task_attachments" ADD CONSTRAINT "task_attachments_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "media_files"."files"("file_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_events" ADD CONSTRAINT "staff_events_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "profiles"."staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_events" ADD CONSTRAINT "staff_events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_events" ADD CONSTRAINT "staff_events_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_events" ADD CONSTRAINT "staff_events_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "organizations"."departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."staff_events" ADD CONSTRAINT "staff_events_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "profiles"."users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."daily_events" ADD CONSTRAINT "daily_events_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."daily_events" ADD CONSTRAINT "daily_events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."daily_events" ADD CONSTRAINT "daily_events_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."activity_logs" ADD CONSTRAINT "activity_logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."activity_logs" ADD CONSTRAINT "activity_logs_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."activity_logs" ADD CONSTRAINT "activity_logs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "organizations"."departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."activity_logs" ADD CONSTRAINT "activity_logs_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_user_calendar_events" ADD CONSTRAINT "_user_calendar_events_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"."calendar_events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_user_calendar_events" ADD CONSTRAINT "_user_calendar_events_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
