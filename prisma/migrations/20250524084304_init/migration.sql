/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,slug,is_org_level]` on the table `organization_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "organization_roles_organization_id_slug_is_org_level_key" ON "roles"."organization_roles"("organization_id", "slug", "is_org_level");
