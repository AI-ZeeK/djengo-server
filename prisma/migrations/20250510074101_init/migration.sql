/*
  Warnings:

  - You are about to drop the column `multi_branch` on the `company` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "organizations"."DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "organizations"."CompanyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "organizations"."EventType" AS ENUM ('MEETING', 'TASK', 'REMINDER', 'HOLIDAY', 'LEAVE', 'OTHER');

-- AlterTable
ALTER TABLE "organizations"."company" DROP COLUMN "multi_branch",
ADD COLUMN     "company_status" "organizations"."CompanyStatus" DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "organizations"."business_days" (
    "day_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "day_of_week" "organizations"."DayOfWeek" NOT NULL DEFAULT 'MONDAY',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "business_days_pkey" PRIMARY KEY ("day_id")
);

-- CreateTable
CREATE TABLE "organizations"."business_hours" (
    "business_hours_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "day_of_week" "organizations"."DayOfWeek" NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_hours_pkey" PRIMARY KEY ("business_hours_id")
);

-- CreateTable
CREATE TABLE "organizations"."company_meta_data" (
    "company_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "multi_branch" BOOLEAN DEFAULT false,
    "has_hotel" BOOLEAN DEFAULT false,
    "has_restaurant" BOOLEAN DEFAULT false,
    "has_supermarket" BOOLEAN DEFAULT false,
    "has_hospital" BOOLEAN DEFAULT false,
    "staff_count" INTEGER NOT NULL DEFAULT 0,
    "branch_count" INTEGER NOT NULL DEFAULT 0,
    "has_same_weekday_business_hours" BOOLEAN NOT NULL DEFAULT false,
    "is_24_hour_business" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "company_meta_data_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "organizations"."calendar_events" (
    "event_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6) NOT NULL,
    "event_type" "organizations"."EventType" NOT NULL DEFAULT 'OTHER',
    "is_all_day" BOOLEAN NOT NULL DEFAULT false,
    "color" VARCHAR(7),
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence_rule" VARCHAR(255),
    "company_id" UUID NOT NULL,
    "created_by_staff_id" UUID NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE INDEX "business_hours_company_id_idx" ON "organizations"."business_hours"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_company_id_day_of_week_key" ON "organizations"."business_hours"("company_id", "day_of_week");

-- CreateIndex
CREATE INDEX "calendar_events_company_id_idx" ON "organizations"."calendar_events"("company_id");

-- CreateIndex
CREATE INDEX "calendar_events_created_by_staff_id_idx" ON "organizations"."calendar_events"("created_by_staff_id");

-- CreateIndex
CREATE INDEX "calendar_events_start_time_idx" ON "organizations"."calendar_events"("start_time");

-- AddForeignKey
ALTER TABLE "organizations"."business_hours" ADD CONSTRAINT "business_hours_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company_meta_data" ADD CONSTRAINT "company_meta_data_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."calendar_events" ADD CONSTRAINT "calendar_events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."calendar_events" ADD CONSTRAINT "calendar_events_created_by_staff_id_fkey" FOREIGN KEY ("created_by_staff_id") REFERENCES "profiles"."staff"("staff_id") ON DELETE CASCADE ON UPDATE CASCADE;
