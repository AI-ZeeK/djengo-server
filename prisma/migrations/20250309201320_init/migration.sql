/*
  Warnings:

  - You are about to drop the column `business_id` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `is_global` on the `roles` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "roles"."AccessLevel" AS ENUM ('BRANCH_MANAGER', 'GLOBAL_MANAGER');

-- CreateEnum
CREATE TYPE "organizations"."ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "roles"."roles" DROP COLUMN "business_id",
DROP COLUMN "is_global";

-- CreateTable
CREATE TABLE "organizations"."hotels" (
    "hotel_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "hotel_name" VARCHAR(100) NOT NULL,
    "company_id" UUID NOT NULL,
    "total_floors" INTEGER NOT NULL,
    "total_rooms" INTEGER NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("hotel_id")
);

-- CreateTable
CREATE TABLE "organizations"."branches" (
    "branch_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_name" VARCHAR(100) NOT NULL,
    "company_id" UUID NOT NULL,
    "hotel_id" UUID,
    "restaurant_id" UUID,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("branch_id")
);

-- CreateTable
CREATE TABLE "roles"."branch_access" (
    "access_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "branch_id" UUID,
    "company_id" UUID,
    "access_level" "roles"."AccessLevel" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_access_pkey" PRIMARY KEY ("access_id")
);

-- CreateTable
CREATE TABLE "financials"."branch_reports" (
    "report_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_id" UUID NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "occupancy_rate" DECIMAL(65,30) NOT NULL,
    "total_revenue" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "financials"."global_reports" (
    "report_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "total_occupancy_rate" DECIMAL(65,30) NOT NULL,
    "total_revenue" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "organizations"."reservations" (
    "reservation_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "room_id" UUID,
    "table_id" UUID,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "organizations"."ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "organizations"."rooms" (
    "room_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "room_number" VARCHAR(10) NOT NULL,
    "room_type_id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "is_available" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "organizations"."room_types" (
    "room_type_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "room_type_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "price_per_night" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("room_type_id")
);

-- CreateTable
CREATE TABLE "organizations"."restaurants" (
    "restaurant_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "restaurant_name" VARCHAR(100) NOT NULL,
    "company_id" UUID NOT NULL,
    "total_tables" INTEGER NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateTable
CREATE TABLE "organizations"."tables" (
    "table_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "table_number" VARCHAR(10) NOT NULL,
    "table_type_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "is_available" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("table_id")
);

-- CreateTable
CREATE TABLE "organizations"."table_types" (
    "table_type_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "table_type_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "table_types_pkey" PRIMARY KEY ("table_type_id")
);

-- CreateTable
CREATE TABLE "financials"."hotel_reports" (
    "report_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "hotel_id" UUID NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "occupancy_rate" DECIMAL(65,30) NOT NULL,
    "total_revenue" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "financials"."restaurant_reports" (
    "report_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "restaurant_id" UUID NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "occupancy_rate" DECIMAL(65,30) NOT NULL,
    "total_revenue" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurant_reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "organizations"."_BranchToRoom" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_BranchToRoom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "organizations"."_BranchToTable" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_BranchToTable_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BranchToRoom_B_index" ON "organizations"."_BranchToRoom"("B");

-- CreateIndex
CREATE INDEX "_BranchToTable_B_index" ON "organizations"."_BranchToTable"("B");

-- AddForeignKey
ALTER TABLE "organizations"."hotels" ADD CONSTRAINT "hotels_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."branches" ADD CONSTRAINT "branches_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."branches" ADD CONSTRAINT "branches_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "organizations"."hotels"("hotel_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."branches" ADD CONSTRAINT "branches_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "organizations"."restaurants"("restaurant_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."branch_access" ADD CONSTRAINT "branch_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."branch_access" ADD CONSTRAINT "branch_access_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."branch_access" ADD CONSTRAINT "branch_access_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."branch_reports" ADD CONSTRAINT "branch_reports_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."global_reports" ADD CONSTRAINT "global_reports_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."reservations" ADD CONSTRAINT "reservations_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "organizations"."branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."reservations" ADD CONSTRAINT "reservations_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "organizations"."rooms"("room_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."reservations" ADD CONSTRAINT "reservations_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "organizations"."tables"("table_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."rooms" ADD CONSTRAINT "rooms_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "organizations"."room_types"("room_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."rooms" ADD CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "organizations"."hotels"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."restaurants" ADD CONSTRAINT "restaurants_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."tables" ADD CONSTRAINT "tables_table_type_id_fkey" FOREIGN KEY ("table_type_id") REFERENCES "organizations"."table_types"("table_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."tables" ADD CONSTRAINT "tables_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "organizations"."restaurants"("restaurant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."hotel_reports" ADD CONSTRAINT "hotel_reports_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "organizations"."hotels"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."restaurant_reports" ADD CONSTRAINT "restaurant_reports_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "organizations"."restaurants"("restaurant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_BranchToRoom" ADD CONSTRAINT "_BranchToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"."branches"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_BranchToRoom" ADD CONSTRAINT "_BranchToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"."rooms"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_BranchToTable" ADD CONSTRAINT "_BranchToTable_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"."branches"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_BranchToTable" ADD CONSTRAINT "_BranchToTable_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"."tables"("table_id") ON DELETE CASCADE ON UPDATE CASCADE;
