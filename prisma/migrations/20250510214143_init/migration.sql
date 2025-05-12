-- AlterTable
ALTER TABLE "organizations"."organizations" ADD COLUMN     "registration_date" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "profiles"."staff" ALTER COLUMN "branch_id" DROP NOT NULL;
