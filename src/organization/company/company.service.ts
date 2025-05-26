import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationRequest } from 'src/interfaces/user.interface';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}
  create(createCompanyDto: CreateCompanyDto) {}

  findOrganizationCompanies({ req_user }: { req_user: OrganizationRequest }) {
    try {
      return this.prisma.company.findMany({
        where: {
          organization_id: req_user.user.organization_id,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
