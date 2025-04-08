-- AlterTable
ALTER TABLE "organizations"."company" ADD COLUMN     "multi_branch" BOOLEAN DEFAULT false,
ADD COLUMN     "registration_number" VARCHAR(50),
ALTER COLUMN "registeration_date" DROP NOT NULL,
ALTER COLUMN "registeration_date" DROP DEFAULT,
ALTER COLUMN "registeration_date" SET DATA TYPE TIMESTAMPTZ(6);
