/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient as PrismaMainClient } from '@internal/prisma-main';
import { ADDRESS_TYPE_ENUM, FILE_ENTITY_TYPE_ENUM, ROLES_ENUM } from '../enum';

const prisma = new PrismaMainClient();

async function main() {
  // Seed main database
  await seedMainDatabase();
}
const roles = [
  // {
  //   role_name: ROLES_ENUM.BUSINESS_USER,
  //   description:
  //     'Works under a company or agency and manages its operations on the platform.',
  // },
  {
    role_name: ROLES_ENUM.PLATFORM,
    description: 'Manages platform-level features and settings.',
  },
  {
    role_name: ROLES_ENUM.CLIENT,
    description: 'Books and uses services (e.g., houses, Airbnbs, hotels).',
  },
  {
    role_name: ROLES_ENUM.COMPANY,
    description:
      'Represents a company and manages its operations on the platform.',
  },
  {
    role_name: ROLES_ENUM.STAFF,
    description:
      'Works under a company or agency to manage day-to-day operations.',
  },
  {
    role_name: ROLES_ENUM.AGENCY,
    description: 'Manages rental properties (e.g., Airbnbs, houses).',
  },
];

const file_entity_types = [
  {
    entity_type: FILE_ENTITY_TYPE_ENUM.USER_AVATAR,
    description:
      'Profile pictures for individual users, displayed in profiles, chat interfaces, and reviews.',
    max_file_size: 5242880, // 5MB
    allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp'],
    is_active: true,
  },
  {
    entity_type: FILE_ENTITY_TYPE_ENUM.BUSINESS_LOGO,
    description:
      'Company logos and branding images for service provider businesses.',
    max_file_size: 10485760, // 10MB
    allowed_mime_types: ['image/jpeg', 'image/png', 'image/svg+xml'],
    is_active: true,
  },
];
const address_entity_types = [
  {
    entity_type: ADDRESS_TYPE_ENUM.USER_HOME,
    description:
      'Primary residential address where clients receive services such as cleaning, repairs, or maintenance. Used for accurate service scheduling and pricing calculations.',
    // required_fields: ['street', 'building', 'city', 'country'],
    max_addresses_per_entity: 1,
    is_active: true,
  },
  {
    entity_type: ADDRESS_TYPE_ENUM.USER_WORK,
    description:
      "Secondary address for service delivery at client's workplace, useful for commercial cleaning, maintenance, or professional services during business hours.",
    // required_fields: ['street', 'building', 'city', 'country'],
    max_addresses_per_entity: 3,
    is_active: true,
  },
  {
    entity_type: ADDRESS_TYPE_ENUM.BUSINESS_PRIMARY,
    description:
      'Main business location for service provider companies, serving as headquarters for operations, staff management, and client meetings.',
    // required_fields: ['street', 'building', 'city', 'country', 'postal_code'],
    max_addresses_per_entity: 1,
    is_active: true,
  },
  {
    entity_type: ADDRESS_TYPE_ENUM.BUSINESS_BRANCH,
    description:
      'Additional service locations or offices of a business, enabling broader service coverage and local team management.',
    // required_fields: ['street', 'building', 'city', 'country'],
    max_addresses_per_entity: null,
    is_active: true,
  },
];

const platform_roles = [
  {
    role_name: 'SUPER_ADMIN',
    description: 'Full access to all platform data and settings.',
  },
  {
    role_name: 'ADMIN',
    description:
      'Manages platform-level features (e.g., user management, analytics).',
  },
  {
    role_name: 'SUPPORT_STAFF',
    description:
      'Handles customer support and resolves platform-related issues.',
  },
  {
    role_name: 'AUDITOR',
    description:
      'Reviews platform data for compliance and security. Read-only access.',
  },
  {
    role_name: 'DEVELOPER',
    description: 'Manages platform development and technical issues.',
  },
  {
    role_name: 'MARKETING_MANAGER',
    description: 'Handles platform marketing and promotions.',
  },
  {
    role_name: 'CONTENT_MODERATOR',
    description: 'Manages platform content (e.g., reviews, listings).',
  },
  {
    role_name: 'FINANCE_MANAGER',
    description: 'Manages platform finances (e.g., payments, subscriptions).',
  },
  {
    role_name: 'DATA_ANALYST',
    description: 'Analyzes platform data and generates reports.',
  },
  {
    role_name: 'SECURITY_OFFICER',
    description: 'Monitors platform security and handles incidents.',
  },
];

const platform_permissions = [
  { permission: 'manage_users', description: 'Can manage platform users.' },
  {
    permission: 'manage_settings',
    description: 'Can manage platform settings.',
  },
  {
    permission: 'manage_content',
    description: 'Can manage platform content (e.g., reviews, listings).',
  },
  {
    permission: 'manage_finances',
    description:
      'Can manage platform finances (e.g., payments, subscriptions).',
  },
  { permission: 'view_reports', description: 'Can view platform reports.' },
  {
    permission: 'manage_security',
    description: 'Can manage platform security settings.',
  },
  {
    permission: 'manage_support',
    description: 'Can manage customer support tickets.',
  },
  {
    permission: 'manage_marketing',
    description: 'Can manage platform marketing and promotions.',
  },
  {
    permission: 'manage_development',
    description: 'Can manage platform development and technical issues.',
  },
  {
    permission: 'audit_data',
    description: 'Can audit platform data for compliance and security.',
  },
];
const platform_role_permissions = [
  // Super Admin permissions
  { role_name: 'Super Admin', permission: 'manage_users' },
  { role_name: 'Super Admin', permission: 'manage_settings' },
  { role_name: 'Super Admin', permission: 'manage_content' },
  { role_name: 'Super Admin', permission: 'manage_finances' },
  { role_name: 'Super Admin', permission: 'view_reports' },
  { role_name: 'Super Admin', permission: 'manage_security' },
  { role_name: 'Super Admin', permission: 'manage_support' },
  { role_name: 'Super Admin', permission: 'manage_marketing' },
  { role_name: 'Super Admin', permission: 'manage_development' },
  { role_name: 'Super Admin', permission: 'audit_data' },

  // Admin permissions
  { role_name: 'Admin', permission: 'manage_users' },
  { role_name: 'Admin', permission: 'manage_settings' },
  { role_name: 'Admin', permission: 'view_reports' },

  // Support Staff permissions
  { role_name: 'Support Staff', permission: 'manage_support' },

  // Auditor permissions
  { role_name: 'Auditor', permission: 'audit_data' },

  // Developer permissions
  { role_name: 'Developer', permission: 'manage_development' },

  // Marketing Manager permissions
  { role_name: 'Marketing Manager', permission: 'manage_marketing' },

  // Content Moderator permissions
  { role_name: 'Content Moderator', permission: 'manage_content' },

  // Finance Manager permissions
  { role_name: 'Finance Manager', permission: 'manage_finances' },

  // Data Analyst permissions
  { role_name: 'Data Analyst', permission: 'view_reports' },

  // Security Officer permissions
  { role_name: 'Security Officer', permission: 'manage_security' },
];

async function seedMainDatabase() {
  try {
    for (const role of roles) {
      const _role = await prisma.role.upsert({
        where: {
          role_name: role.role_name,
        },
        update: {},
        create: {
          role_name: role.role_name,
          description: role.description,
        },
      });
      console.log(`role:- ${_role.role_name} seeded successfully`);
    }
    for (const file_entity of file_entity_types) {
      const createdType = await prisma.fileEntityType.upsert({
        where: { entity_type: file_entity.entity_type },
        update: {},
        create: file_entity,
      });
      console.log(`Created file entity type: ${createdType.entity_type}`);
    }

    console.log('Creating address entity types in main database...');
    for (const type of address_entity_types) {
      await prisma.addressEntity.upsert({
        where: { entity_type: type.entity_type },
        update: {
          description: type.description,
          // required_fields: type.required_fields,
          max_addresses_per_entity: type.max_addresses_per_entity,
          is_active: type.is_active,
        },
        create: type,
      });
      console.log(
        `Created/Updated address entity type in main: ${type.entity_type}`,
      );
    }
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
