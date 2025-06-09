/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `business_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `business_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "profiles"."business_users" ADD COLUMN     "email" VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN     "phone_number" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "business_users_email_key" ON "profiles"."business_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "business_users_phone_number_key" ON "profiles"."business_users"("phone_number");
