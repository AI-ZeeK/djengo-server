-- AlterTable
ALTER TABLE "roles"."entity_permissions" ADD COLUMN     "organization_role_id" UUID;

-- AddForeignKey
ALTER TABLE "roles"."entity_permissions" ADD CONSTRAINT "entity_permissions_organization_role_id_fkey" FOREIGN KEY ("organization_role_id") REFERENCES "roles"."organization_roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
