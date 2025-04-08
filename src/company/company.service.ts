import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}
  create(createCompanyDto: CreateCompanyDto) {
    return 'This action adds a new company';
  }
  async fetchByCompanyRef({ company_ref }: { company_ref: string }) {
    try {
      const company = await this.prisma.company.findUnique({
        where: {
          company_ref,
        },
      });

      if (!company)
        return {
          status: false,
          message: 'Company not found',
          data: null,
        };
      return {
        status: true,
        message: 'Company found',
        data: company,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return `This action returns all company`;
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
