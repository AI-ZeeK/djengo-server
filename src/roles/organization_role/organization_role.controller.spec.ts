import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationRoleController } from './organization_role.controller';
import { OrganizationRoleService } from './organization_role.service';

describe('OrganizationRoleController', () => {
  let controller: OrganizationRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationRoleController],
      providers: [OrganizationRoleService],
    }).compile();

    controller = module.get<OrganizationRoleController>(OrganizationRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
