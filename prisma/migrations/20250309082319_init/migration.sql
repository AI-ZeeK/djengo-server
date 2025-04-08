-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "addresses_and_contacts";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "financials";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "general";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "media_files";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "organizations";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "profiles";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "roles";

-- CreateEnum
CREATE TYPE "financials"."TransactionStatus" AS ENUM ('PENDING', 'FAILED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "general"."SituationStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "general"."PaymentSchedule" AS ENUM ('WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "general"."PayrollStatus" AS ENUM ('PENDING', 'INPROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "roles"."roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50),
    "description" TEXT DEFAULT '',
    "is_active" BOOLEAN DEFAULT true,
    "is_global" BOOLEAN DEFAULT false,
    "business_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "profiles"."users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" VARCHAR(50) DEFAULT '',
    "last_name" VARCHAR(50) DEFAULT '',
    "date_of_birth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "backup_phone_number" VARCHAR(20),
    "email_verified" BOOLEAN DEFAULT false,
    "phone_verified" BOOLEAN DEFAULT false,
    "kyc_verified" BOOLEAN DEFAULT false,
    "is_blocked" BOOLEAN DEFAULT false,
    "fcm_token" TEXT NOT NULL DEFAULT '',
    "refresh_token" TEXT NOT NULL DEFAULT '',
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "roles"."department_hierarchy" (
    "role_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_name" VARCHAR(50) NOT NULL,
    "department_id" UUID NOT NULL,
    "reports_to" UUID,
    "is_manager" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_hierarchy_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "organizations"."company" (
    "company_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_ref" VARCHAR(255),
    "company_name" VARCHAR(50),
    "email" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "backup_phone_number" VARCHAR(20),
    "registeration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email_verified" BOOLEAN DEFAULT false,
    "phone_verified" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "organizations"."departments" (
    "department_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "department_name" VARCHAR(50) NOT NULL,
    "description" TEXT DEFAULT '',
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "organizations"."company_hierarchy" (
    "hierarchy_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "reports_to" UUID,
    "level_name" VARCHAR(50) NOT NULL,
    "level_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_hierarchy_pkey" PRIMARY KEY ("hierarchy_id")
);

-- CreateTable
CREATE TABLE "profiles"."staff" (
    "staff_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID,
    "date_joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "role_id" UUID,
    "department_id" UUID,
    "designation" TEXT,
    "profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "payroll_active" BOOLEAN NOT NULL DEFAULT true,
    "staff_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "profiles"."staff_probation_info" (
    "staff_probabtion_id" SERIAL NOT NULL,
    "probation_starts_at" TIMESTAMP(3),
    "probation_ends_at" TIMESTAMP(3),
    "probation_salary" INTEGER,
    "staff_id" UUID NOT NULL,
    "probation_status" "general"."SituationStatus" NOT NULL DEFAULT 'INACTIVE',

    CONSTRAINT "staff_probation_info_pkey" PRIMARY KEY ("staff_probabtion_id")
);

-- CreateTable
CREATE TABLE "profiles"."staff_payment_information" (
    "staff_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "salary_amount" INTEGER NOT NULL DEFAULT 0,
    "bank_name" TEXT DEFAULT '',
    "bank_code" TEXT DEFAULT '',
    "bank_account_number" TEXT DEFAULT '',
    "payment_schedule" "general"."PaymentSchedule" NOT NULL DEFAULT 'MONTHLY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_payment_information_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "addresses_and_contacts"."addresses" (
    "address_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" VARCHAR(50) DEFAULT 'main',
    "is_default" BOOLEAN DEFAULT true,
    "is_active" BOOLEAN DEFAULT true,
    "street" VARCHAR(100),
    "building" VARCHAR(50),
    "apartment" VARCHAR(25),
    "district" VARCHAR(50),
    "landmark" VARCHAR(100),
    "instruction_enter_building" VARCHAR(100),
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "postal_code" VARCHAR(20),
    "country" VARCHAR(50),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "direction_url" TEXT NOT NULL DEFAULT '',
    "entity_id" UUID NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "entity_type_id" INTEGER NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "addresses_and_contacts"."address_entity_types" (
    "entity_type_id" SERIAL NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "max_addresses_per_entity" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_entity_types_pkey" PRIMARY KEY ("entity_type_id")
);

-- CreateTable
CREATE TABLE "financials"."payrolls" (
    "payroll_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "schedule_id" UUID NOT NULL,
    "completed_at" TIMESTAMP(3),
    "status" "general"."PayrollStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payrolls_pkey" PRIMARY KEY ("payroll_id")
);

-- CreateTable
CREATE TABLE "financials"."payroll_schedule" (
    "schedule_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL DEFAULT '',
    "company_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "general"."SituationStatus" NOT NULL DEFAULT 'INACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "financials"."payroll_staff" (
    "payroll_staff_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "staff_id" UUID NOT NULL,
    "payroll_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "general"."PayrollStatus" NOT NULL DEFAULT 'INPROGRESS',

    CONSTRAINT "payroll_staff_pkey" PRIMARY KEY ("payroll_staff_id")
);

-- CreateTable
CREATE TABLE "financials"."currencies" (
    "currency_code" VARCHAR(10) NOT NULL,
    "currency_name" TEXT NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("currency_code")
);

-- CreateTable
CREATE TABLE "financials"."exchange_rates" (
    "id" SERIAL NOT NULL,
    "base_currency" TEXT NOT NULL DEFAULT 'USD',
    "currency_code" VARCHAR(10) NOT NULL,
    "rate_to_usd" DECIMAL(65,30) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financials"."transaction_types" (
    "type_id" SERIAL NOT NULL,
    "type_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "category_id" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_types_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "financials"."categories" (
    "type_id" SERIAL NOT NULL,
    "type_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "financials"."transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount_usd" DECIMAL(65,30) NOT NULL,
    "specification" VARCHAR(255) NOT NULL,
    "transaction_ref" TEXT,
    "status" "financials"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "currency_code" VARCHAR(10) NOT NULL,
    "exchange_rate" DECIMAL(65,30) NOT NULL,
    "amount_converted" DECIMAL(65,30) NOT NULL,
    "receiver_user_id" UUID,
    "company_id" UUID,
    "sender_user_id" UUID,
    "transaction_type_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files"."file_entity_types" (
    "entity_type_id" SERIAL NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "max_file_size" INTEGER,
    "allowed_mime_types" TEXT[],
    "max_files_per_entity" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_entity_types_pkey" PRIMARY KEY ("entity_type_id")
);

-- CreateTable
CREATE TABLE "media_files"."files" (
    "file_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "file_url" TEXT,
    "file_type" TEXT,
    "file_size" INTEGER,
    "description" VARCHAR(50),
    "uploaded_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_user_id" UUID,
    "entity_id" UUID NOT NULL,
    "entity_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "files_pkey" PRIMARY KEY ("file_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"."roles"("role_name");

-- CreateIndex
CREATE INDEX "idx_roles_role_name" ON "roles"."roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "profiles"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "profiles"."users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_backup_phone_number_key" ON "profiles"."users"("backup_phone_number");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "profiles"."users"("email");

-- CreateIndex
CREATE INDEX "idx_users_phone_number" ON "profiles"."users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "department_hierarchy_department_id_role_name_key" ON "roles"."department_hierarchy"("department_id", "role_name");

-- CreateIndex
CREATE UNIQUE INDEX "company_company_ref_key" ON "organizations"."company"("company_ref");

-- CreateIndex
CREATE UNIQUE INDEX "company_email_key" ON "organizations"."company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "company_phone_number_key" ON "organizations"."company"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "departments_company_id_department_name_key" ON "organizations"."departments"("company_id", "department_name");

-- CreateIndex
CREATE INDEX "addresses_city_idx" ON "addresses_and_contacts"."addresses"("city");

-- CreateIndex
CREATE INDEX "addresses_country_idx" ON "addresses_and_contacts"."addresses"("country");

-- CreateIndex
CREATE INDEX "addresses_entity_type_id_idx" ON "addresses_and_contacts"."addresses"("entity_type_id");

-- CreateIndex
CREATE INDEX "idx_addresses_entity_type_id" ON "addresses_and_contacts"."addresses"("entity_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_entity_type_entity_id_label_idx" ON "addresses_and_contacts"."addresses"("entity_type_id", "entity_id", "label");

-- CreateIndex
CREATE UNIQUE INDEX "address_entity_types_entity_type_key" ON "addresses_and_contacts"."address_entity_types"("entity_type");

-- CreateIndex
CREATE INDEX "idx_address_entity_types_entity_type" ON "addresses_and_contacts"."address_entity_types"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "payrolls_schedule_id_key" ON "financials"."payrolls"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_currency_name_key" ON "financials"."currencies"("currency_name");

-- CreateIndex
CREATE UNIQUE INDEX "exchange_rates_currency_code_key" ON "financials"."exchange_rates"("currency_code");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_types_type_name_key" ON "financials"."transaction_types"("type_name");

-- CreateIndex
CREATE INDEX "idx_transaction_types_type_name" ON "financials"."transaction_types"("type_name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_type_name_key" ON "financials"."categories"("type_name");

-- CreateIndex
CREATE INDEX "idx_category_types_type_name" ON "financials"."categories"("type_name");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_ref_key" ON "financials"."transactions"("transaction_ref");

-- CreateIndex
CREATE UNIQUE INDEX "file_entity_types_entity_type_key" ON "media_files"."file_entity_types"("entity_type");

-- CreateIndex
CREATE INDEX "idx_file_entity_types_entity_type" ON "media_files"."file_entity_types"("entity_type");

-- CreateIndex
CREATE INDEX "files_entity_type_id_idx" ON "media_files"."files"("entity_type_id");

-- CreateIndex
CREATE INDEX "idx_files_entity_type_id" ON "media_files"."files"("entity_type_id");

-- CreateIndex
CREATE INDEX "idx_files_uploaded_by_user_id" ON "media_files"."files"("uploaded_by_user_id");

-- AddForeignKey
ALTER TABLE "roles"."department_hierarchy" ADD CONSTRAINT "department_hierarchy_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "organizations"."departments"("department_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles"."department_hierarchy" ADD CONSTRAINT "department_hierarchy_reports_to_fkey" FOREIGN KEY ("reports_to") REFERENCES "roles"."department_hierarchy"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company" ADD CONSTRAINT "company_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."departments" ADD CONSTRAINT "departments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company_hierarchy" ADD CONSTRAINT "company_hierarchy_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."company_hierarchy" ADD CONSTRAINT "company_hierarchy_reports_to_fkey" FOREIGN KEY ("reports_to") REFERENCES "organizations"."company_hierarchy"("hierarchy_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."staff" ADD CONSTRAINT "staff_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."staff" ADD CONSTRAINT "staff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "organizations"."departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."staff" ADD CONSTRAINT "staff_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"."department_hierarchy"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."staff_probation_info" ADD CONSTRAINT "staff_probation_info_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "profiles"."staff"("staff_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"."staff_payment_information" ADD CONSTRAINT "staff_payment_information_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "profiles"."staff"("staff_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses_and_contacts"."addresses" ADD CONSTRAINT "fk_addresses_entity_type" FOREIGN KEY ("entity_type_id") REFERENCES "addresses_and_contacts"."address_entity_types"("entity_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financials"."payrolls" ADD CONSTRAINT "payrolls_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "financials"."payroll_schedule"("schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."payroll_schedule" ADD CONSTRAINT "payroll_schedule_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."payroll_staff" ADD CONSTRAINT "payroll_staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "profiles"."staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."payroll_staff" ADD CONSTRAINT "payroll_staff_payroll_id_fkey" FOREIGN KEY ("payroll_id") REFERENCES "financials"."payrolls"("payroll_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."exchange_rates" ADD CONSTRAINT "exchange_rates_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "financials"."currencies"("currency_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials"."transaction_types" ADD CONSTRAINT "transaction_types_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "financials"."categories"("type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financials"."transactions" ADD CONSTRAINT "transactions_transaction_type_id_fkey" FOREIGN KEY ("transaction_type_id") REFERENCES "financials"."transaction_types"("type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financials"."transactions" ADD CONSTRAINT "transactions_receiver_user_id_fkey" FOREIGN KEY ("receiver_user_id") REFERENCES "profiles"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financials"."transactions" ADD CONSTRAINT "transactions_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "profiles"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financials"."transactions" ADD CONSTRAINT "transactions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "organizations"."company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financials"."transactions" ADD CONSTRAINT "transactions_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "financials"."currencies"("currency_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files"."files" ADD CONSTRAINT "files_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "media_files"."file_entity_types"("entity_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files"."files" ADD CONSTRAINT "files_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "profiles"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
