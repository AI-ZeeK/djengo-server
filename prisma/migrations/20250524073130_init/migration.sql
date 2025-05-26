/*
  Warnings:

  - A unique constraint covering the columns `[user_id,is_active]` on the table `business_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `activity_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "organizations"."ActivityCategory" AS ENUM ('PAYMENT', 'ORDER', 'INVOICE', 'STAFF', 'INVENTORY', 'SYSTEM', 'CUSTOMER', 'FINANCIAL', 'SECURITY', 'OTHER');

-- CreateEnum
CREATE TYPE "organizations"."ActivityPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "organizations"."ActivityStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'REQUIRES_ATTENTION');

-- CreateEnum
CREATE TYPE "organizations"."ActivityStyle" AS ENUM ('SUCCESS', 'WARNING', 'ERROR', 'INFO', 'NEUTRAL', 'HIGHLIGHT');

-- CreateEnum
CREATE TYPE "organizations"."ActivityActionType" AS ENUM ('NONE', 'COPY', 'LINK', 'VIEW', 'DOWNLOAD', 'CUSTOM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "organizations"."ActivityType" ADD VALUE 'RISK_ALERT';
ALTER TYPE "organizations"."ActivityType" ADD VALUE 'WARNING';
ALTER TYPE "organizations"."ActivityType" ADD VALUE 'INVOICE_DUE';
ALTER TYPE "organizations"."ActivityType" ADD VALUE 'INVOICE_PAID';
ALTER TYPE "organizations"."ActivityType" ADD VALUE 'INVOICE_OVERDUE';
ALTER TYPE "organizations"."ActivityType" ADD VALUE 'INVOICE_CANCELLED';
ALTER TYPE "organizations"."ActivityType" ADD VALUE 'ORDER_RELATED';
ALTER TYPE "organizations"."ActivityType" ADD VALUE 'INVOICE_RELATED';
ALTER TYPE "organizations"."ActivityType" ADD VALUE 'ASSIGNED';

-- AlterTable
ALTER TABLE "organizations"."activity_logs" ADD COLUMN     "action_type" "organizations"."ActivityActionType" DEFAULT 'NONE',
ADD COLUMN     "action_value" VARCHAR(255),
ADD COLUMN     "avatar_url" VARCHAR(255),
ADD COLUMN     "badge_text" VARCHAR(50),
ADD COLUMN     "badges" JSONB,
ADD COLUMN     "category" "organizations"."ActivityCategory" NOT NULL,
ADD COLUMN     "color_scheme" VARCHAR(50),
ADD COLUMN     "extra" JSONB,
ADD COLUMN     "icon_name" VARCHAR(50),
ADD COLUMN     "priority" "organizations"."ActivityPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "requires_action" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "secondary_text" VARCHAR(255),
ADD COLUMN     "status" "organizations"."ActivityStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "style" "organizations"."ActivityStyle" NOT NULL DEFAULT 'NEUTRAL';

-- CreateIndex
CREATE INDEX "activity_logs_category_idx" ON "organizations"."activity_logs"("category");

-- CreateIndex
CREATE INDEX "activity_logs_priority_idx" ON "organizations"."activity_logs"("priority");

-- CreateIndex
CREATE INDEX "activity_logs_status_idx" ON "organizations"."activity_logs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "business_users_user_id_is_active_key" ON "profiles"."business_users"("user_id", "is_active");
