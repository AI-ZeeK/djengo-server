/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company, Staff, VerificationPurpose } from '@internal/prisma-main';
import { MailService } from 'src/mail/mail.service';
import { Helpers } from 'src/lib/helper/helpers';
import { ROLES_ENUM } from 'prisma/enum';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
    private userService: UserService,
  ) {}
  async validateRefreshToken({
    user_id,
    company_id,
    staff_id,
    refresh_token,
  }: {
    user_id: string;
    refresh_token: string;
    company_id?: string;
    staff_id?: string;
  }) {
    try {
      const user = await this.prisma.user.findUnique({ where: { user_id } });

      if (!user || !user.refresh_token) {
        return null;
      }

      const isValid = await bcrypt.compare(refresh_token, user.refresh_token);
      if (!isValid) {
        return null;
      }
      let company: Company | null = null;
      let staff: Staff | null = null;
      if (company_id) {
        company = await this.prisma.company.findUnique({
          where: { company_id },
        });
        if (!company) {
          return null;
        }
      }
      if (staff_id) {
        staff = await this.prisma.staff.findUnique({
          where: { staff_id },
        });
        if (!staff) {
          return null;
        }
      }

      const newAccessToken = this.generateAccessToken({
        user_id,
        company_id,
        staff_id,
      });

      return {
        user_id: user.user_id,
        access_token: newAccessToken,
        company,
        staff,
      };
    } catch (error) {
      console.error('Error validating refresh token:', error);
      return null;
    }
  }

  async generateAccessToken({
    user_id,
    company_id,
    staff_id,
  }: {
    user_id: string;
    company_id?: string;
    staff_id?: string;
  }) {
    const payload = {
      user_id,
      company_id,
      staff_id,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    await this.prisma.user.update({
      where: { user_id },
      data: {
        refresh_token: refresh_token,
      },
    });

    return { access_token };
  }

  generateAuthToken({ user_id }: { user_id: string }) {
    const payload = {
      user_id,
    };

    const auth_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '5m',
    });

    return { auth_token };
  }

  async initiateLogin({ email }: { email: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (!user) throw new NotFoundException();
      return this.generateAuthToken({ user_id: user.user_id });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async initiateRegister({
    email,
    role_name,
  }: {
    email: string;
    role_name: string;
  }) {
    try {
      let user = await this.prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (user) throw new BadGatewayException('User Exists, Proceed to login');
      const role = await this.prisma.role.findUnique({
        where: {
          role_name,
        },
      });

      if (!role) throw new NotFoundException('role type unavailable');

      user = await this.prisma.user.create({
        data: {
          email,
          user_roles: {
            create: {
              role_name,
            },
          },
        },
      });

      return this.generateAuthToken({ user_id: user.user_id });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async register({
    email,
    role_name,
    password,
    company_name,
    company_ref,
    phone_number,
    company_email,
    company_phone_number,
    company_registration_date,
    company_registration_number,
    multi_branch,
  }: {
    email: string;
    password: string;
    role_name: string;
    company_name: string;
    company_ref: string;
    phone_number: string;
    company_email: string;
    company_phone_number: string;
    company_registration_date: string;
    company_registration_number: string;
    multi_branch: boolean;
  }) {
    try {
      const { user, company_id, staff_id } = await this.prisma.$transaction(
        async (prisma) => {
          try {
            let user = await prisma.user.findUnique({
              where: {
                email: email.toLowerCase(),
              },
            });

            if (user)
              throw new BadGatewayException('User Exists, Proceed to login');
            const role = await prisma.role.findUnique({
              where: {
                role_name,
              },
            });

            if (!role) throw new NotFoundException('role unavailable');
            const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)

            const hashed_password = await bcrypt.hash(password, saltRounds);

            user = await prisma.user.create({
              data: {
                email: email.toLowerCase(),
                password: hashed_password, // Store the hashed password
                phone_number,
                user_roles: {
                  create: {
                    role_name: role.role_name!,
                    is_active: true,
                  },
                },
              },
            });

            let company_id = '';
            let staff_id = '';

            if (ROLES_ENUM.COMPANY === role.role_name) {
              const company = await prisma.company.create({
                data: {
                  company_name,
                  phone_number: company_phone_number,
                  email: company_email,
                  company_ref:
                    await this.validateCompanyReference(company_name),
                  registeration_date: company_registration_date,
                  registration_number: company_registration_number,
                  multi_branch,
                },
              });
              const user_companies = await prisma.userCompany.findMany({
                where: {
                  user_id: user.user_id,
                },
              });
              if (user_companies.length > 0) {
                const user_company = await prisma.userCompany.create({
                  data: {
                    company_id: company.company_id,
                    user_id: user.user_id,
                    is_primary: false,
                    is_owner: true,
                  },
                });
                company_id = user_company.company_id;
              } else {
                const user_company = await prisma.userCompany.create({
                  data: {
                    company_id: company.company_id,
                    user_id: user.user_id,
                    is_primary: true,
                    is_owner: true,
                  },
                });
                company_id = user_company.company_id;
              }

              await prisma.companyRole.createMany({
                data: [
                  {
                    company_id: company.company_id,
                    name: 'Company Owner',
                    slug: 'company-owner',
                    is_global: true,
                    is_active: true,
                  },
                  {
                    company_id: company.company_id,
                    name: 'Default Staff',
                    slug: 'defuult-staff',
                    is_global: true,
                    is_active: true,
                  },
                ],
              });
            }
            if (ROLES_ENUM.STAFF === role.role_name) {
              const company = await prisma.company.findUnique({
                where: {
                  company_ref,
                },
              });
              const staff = await prisma.staff.create({
                data: {
                  company_id: company?.company_id,
                  user_id: user.user_id,
                },
              });
              staff_id = staff.staff_id;
            }

            const _user = await prisma.user.findUnique({
              where: {
                user_id: user.user_id,
              },
            });

            return { user: _user, staff_id, company_id };
          } catch (error) {
            throw new BadRequestException(error.message);
          }
        },
      );
      const { access_token } = await this.generateAccessToken({
        user_id: user!.user_id,
        company_id,
        staff_id,
      });

      return { user, access_token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async validateCompanyReference(
    company_name: string,
  ): Promise<string> {
    try {
      const company_ref = Helpers.generateUniqueValue(company_name);
      const reference = await this.prisma.company.findUnique({
        where: {
          company_ref,
        },
      });
      if (reference) {
        return await this.validateCompanyReference(company_name);
      }
      return company_ref;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const company = await this.prisma.userCompany.findFirst({
        where: {
          user_id: user.user_id,
          is_primary: true,
        },
      });
      const staff = await this.prisma.staff.findFirst({
        where: {
          user_id: user.user_id,
        },
      });

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password! || '',
      );
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const { access_token } = await this.generateAccessToken({
        user_id: user.user_id,
        company_id: company?.company_id,
        staff_id: staff?.staff_id,
      });

      const _user = await this.userService.findOne({
        user_id: user.user_id,
      });

      return { user: _user, access_token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logout({ user_id }: { user_id: string }) {
    try {
      await this.prisma.user.update({
        where: { user_id },
        data: { refresh_token: '' },
      });
      await this.prisma.pushSubscription.deleteMany({
        where: { user_id },
      });
      this.logger.log(
        `User ${user_id} logged out and push subscriptions cleared`,
      );
      return { message: 'Logout successful' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendOtp({ token }: { token: string }) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      const user = await this.prisma.user.findUnique({
        where: {
          user_id: payload.user_id,
        },
      });
      if (!user) throw new NotFoundException('user for otp not active');
      const otp = Helpers.generateOTP({
        length: 5,
        options: {
          numbers: true,
        },
      });
      await this.prisma.verification.create({
        data: {
          user_id: payload.user_id,
          otp_code: otp,
          purpose: VerificationPurpose.EMAIL_VERIFICATION,
          expires_at: Helpers.getFutureTimestamp({ seconds: 95 }),
        },
      });

      await this.mailService.sendBusinessOtpEmail({
        email: user?.email,
        name: user?.email?.split('@')[0],
        otp,
      });
      return {
        message: 'otp sent successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(user_id: string) {
    try {
      const refreshToken = await this.prisma.user.findUnique({
        where: { user_id },
        select: { refresh_token: true },
      });
      if (!refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const payload = await this.jwtService.verifyAsync(
        refreshToken.refresh_token,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
      // console.log('PAYLOAD', payload);
      const user = await this.prisma.user.findUnique({
        where: { user_id: payload.user_id },
      });
      // console.log('USER', user);
      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }

      const { access_token } = await this.generateAccessToken({
        user_id: user.user_id,
      });

      return { user, access_token };
    } catch (error) {
      console.log('ERROR', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
