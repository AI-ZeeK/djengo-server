/*
  Warnings:

  - You are about to drop the `company_hierarchy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `department_hierarchy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "organizations"."company_hierarchy" DROP CONSTRAINT "company_hierarchy_company_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."company_hierarchy" DROP CONSTRAINT "company_hierarchy_reports_to_fkey";

-- DropForeignKey
ALTER TABLE "profiles"."staff" DROP CONSTRAINT "staff_role_id_fkey";

-- DropForeignKey
ALTER TABLE "roles"."department_hierarchy" DROP CONSTRAINT "department_hierarchy_department_id_fkey";

-- DropForeignKey
ALTER TABLE "roles"."department_hierarchy" DROP CONSTRAINT "department_hierarchy_reports_to_fkey";

-- DropTable
DROP TABLE "organizations"."company_hierarchy";

-- DropTable
DROP TABLE "roles"."department_hierarchy";
