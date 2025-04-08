export enum CompanyHierarchyLevelEnum {
  CEO = 'CEO',
  COO = 'COO',
  CFO = 'CFO',
  CIO = 'CIO',
  VP_HOSPITALITY = 'VP Hospitality',
  VP_RETAIL = 'VP Retail',
  VP_FINANCE = 'VP Finance',
  VP_MARKETING = 'VP Marketing',
  REGIONAL_DIRECTOR = 'Regional Director',
  DISTRICT_MANAGER = 'District Manager',
  PROPERTY_MANAGER = 'Property Manager',
}

export enum CompanyRoleEnum {
  // Corporate roles
  EXECUTIVE = 'Executive',
  DIRECTOR = 'Director',
  MANAGER = 'Manager',
  SUPERVISOR = 'Supervisor',
  SPECIALIST = 'Specialist',
  COORDINATOR = 'Coordinator',
  ANALYST = 'Analyst',
  ASSISTANT = 'Assistant',

  // Hotel specific roles
  GENERAL_MANAGER = 'General Manager',
  FRONT_DESK_MANAGER = 'Front Desk Manager',
  HOUSEKEEPING_MANAGER = 'Housekeeping Manager',
  CONCIERGE = 'Concierge',
  FRONT_DESK_AGENT = 'Front Desk Agent',
  HOUSEKEEPING_STAFF = 'Housekeeping Staff',
  MAINTENANCE_STAFF = 'Maintenance Staff',

  // Restaurant specific roles
  RESTAURANT_MANAGER = 'Restaurant Manager',
  HEAD_CHEF = 'Head Chef',
  SOUS_CHEF = 'Sous Chef',
  LINE_COOK = 'Line Cook',
  HOST = 'Host/Hostess',
  SERVER = 'Server',
  BARTENDER = 'Bartender',

  // Supermarket specific roles
  STORE_MANAGER = 'Store Manager',
  DEPARTMENT_SUPERVISOR = 'Department Supervisor',
  CASHIER_SUPERVISOR = 'Cashier Supervisor',
  INVENTORY_MANAGER = 'Inventory Manager',
  CASHIER = 'Cashier',
  STOCK_CLERK = 'Stock Clerk',
  DELI_WORKER = 'Deli Worker',
  BAKERY_STAFF = 'Bakery Staff',
}

export enum BranchTypeEnum {
  HOTEL = 'Hotel',
  RESTAURANT = 'Restaurant',
  SUPERMARKET = 'Supermarket',
  CORPORATE_OFFICE = 'Corporate Office',
}

// Map hierarchy levels to their numerical level in the organization
export const CompanyHierarchyLevelMap: Record<
  CompanyHierarchyLevelEnum,
  number
> = {
  [CompanyHierarchyLevelEnum.CEO]: 1,
  [CompanyHierarchyLevelEnum.COO]: 2,
  [CompanyHierarchyLevelEnum.CFO]: 2,
  [CompanyHierarchyLevelEnum.CIO]: 2,
  [CompanyHierarchyLevelEnum.VP_HOSPITALITY]: 3,
  [CompanyHierarchyLevelEnum.VP_RETAIL]: 3,
  [CompanyHierarchyLevelEnum.VP_FINANCE]: 3,
  [CompanyHierarchyLevelEnum.VP_MARKETING]: 3,
  [CompanyHierarchyLevelEnum.REGIONAL_DIRECTOR]: 4,
  [CompanyHierarchyLevelEnum.DISTRICT_MANAGER]: 5,
  [CompanyHierarchyLevelEnum.PROPERTY_MANAGER]: 6,
};

// Map company roles to whether they are manager roles
export const CompanyRoleManagerMap: Record<CompanyRoleEnum, boolean> = {
  // Corporate roles
  [CompanyRoleEnum.EXECUTIVE]: true,
  [CompanyRoleEnum.DIRECTOR]: true,
  [CompanyRoleEnum.MANAGER]: true,
  [CompanyRoleEnum.SUPERVISOR]: true,
  [CompanyRoleEnum.SPECIALIST]: false,
  [CompanyRoleEnum.COORDINATOR]: false,
  [CompanyRoleEnum.ANALYST]: false,
  [CompanyRoleEnum.ASSISTANT]: false,

  // Hotel management roles
  [CompanyRoleEnum.GENERAL_MANAGER]: true,
  [CompanyRoleEnum.FRONT_DESK_MANAGER]: true,
  [CompanyRoleEnum.HOUSEKEEPING_MANAGER]: true,
  [CompanyRoleEnum.CONCIERGE]: false,
  [CompanyRoleEnum.FRONT_DESK_AGENT]: false,
  [CompanyRoleEnum.HOUSEKEEPING_STAFF]: false,
  [CompanyRoleEnum.MAINTENANCE_STAFF]: false,

  // Restaurant management roles
  [CompanyRoleEnum.RESTAURANT_MANAGER]: true,
  [CompanyRoleEnum.HEAD_CHEF]: true,
  [CompanyRoleEnum.SOUS_CHEF]: true,
  [CompanyRoleEnum.LINE_COOK]: false,
  [CompanyRoleEnum.HOST]: false,
  [CompanyRoleEnum.SERVER]: false,
  [CompanyRoleEnum.BARTENDER]: false,

  // Supermarket management roles
  [CompanyRoleEnum.STORE_MANAGER]: true,
  [CompanyRoleEnum.DEPARTMENT_SUPERVISOR]: true,
  [CompanyRoleEnum.CASHIER_SUPERVISOR]: true,
  [CompanyRoleEnum.INVENTORY_MANAGER]: true,
  [CompanyRoleEnum.CASHIER]: false,
  [CompanyRoleEnum.STOCK_CLERK]: false,
  [CompanyRoleEnum.DELI_WORKER]: false,
  [CompanyRoleEnum.BAKERY_STAFF]: false,
};

// Map roles to branch types they can be assigned to
export const RoleToBranchTypeMap: Record<CompanyRoleEnum, BranchTypeEnum[]> = {
  // Corporate roles can be assigned to any branch type
  [CompanyRoleEnum.EXECUTIVE]: [BranchTypeEnum.CORPORATE_OFFICE],
  [CompanyRoleEnum.DIRECTOR]: [BranchTypeEnum.CORPORATE_OFFICE],
  [CompanyRoleEnum.MANAGER]: [
    BranchTypeEnum.CORPORATE_OFFICE,
    BranchTypeEnum.HOTEL,
    BranchTypeEnum.RESTAURANT,
    BranchTypeEnum.SUPERMARKET,
  ],
  [CompanyRoleEnum.SUPERVISOR]: [
    BranchTypeEnum.CORPORATE_OFFICE,
    BranchTypeEnum.HOTEL,
    BranchTypeEnum.RESTAURANT,
    BranchTypeEnum.SUPERMARKET,
  ],
  [CompanyRoleEnum.SPECIALIST]: [BranchTypeEnum.CORPORATE_OFFICE],
  [CompanyRoleEnum.COORDINATOR]: [BranchTypeEnum.CORPORATE_OFFICE],
  [CompanyRoleEnum.ANALYST]: [BranchTypeEnum.CORPORATE_OFFICE],
  [CompanyRoleEnum.ASSISTANT]: [
    BranchTypeEnum.CORPORATE_OFFICE,
    BranchTypeEnum.HOTEL,
    BranchTypeEnum.RESTAURANT,
    BranchTypeEnum.SUPERMARKET,
  ],

  // Hotel specific roles
  [CompanyRoleEnum.GENERAL_MANAGER]: [BranchTypeEnum.HOTEL],
  [CompanyRoleEnum.FRONT_DESK_MANAGER]: [BranchTypeEnum.HOTEL],
  [CompanyRoleEnum.HOUSEKEEPING_MANAGER]: [BranchTypeEnum.HOTEL],
  [CompanyRoleEnum.CONCIERGE]: [BranchTypeEnum.HOTEL],
  [CompanyRoleEnum.FRONT_DESK_AGENT]: [BranchTypeEnum.HOTEL],
  [CompanyRoleEnum.HOUSEKEEPING_STAFF]: [BranchTypeEnum.HOTEL],
  [CompanyRoleEnum.MAINTENANCE_STAFF]: [
    BranchTypeEnum.HOTEL,
    BranchTypeEnum.RESTAURANT,
    BranchTypeEnum.SUPERMARKET,
  ],

  // Restaurant specific roles
  [CompanyRoleEnum.RESTAURANT_MANAGER]: [BranchTypeEnum.RESTAURANT],
  [CompanyRoleEnum.HEAD_CHEF]: [BranchTypeEnum.RESTAURANT],
  [CompanyRoleEnum.SOUS_CHEF]: [BranchTypeEnum.RESTAURANT],
  [CompanyRoleEnum.LINE_COOK]: [BranchTypeEnum.RESTAURANT],
  [CompanyRoleEnum.HOST]: [BranchTypeEnum.RESTAURANT],
  [CompanyRoleEnum.SERVER]: [BranchTypeEnum.RESTAURANT],
  [CompanyRoleEnum.BARTENDER]: [BranchTypeEnum.RESTAURANT],

  // Supermarket specific roles
  [CompanyRoleEnum.STORE_MANAGER]: [BranchTypeEnum.SUPERMARKET],
  [CompanyRoleEnum.DEPARTMENT_SUPERVISOR]: [BranchTypeEnum.SUPERMARKET],
  [CompanyRoleEnum.CASHIER_SUPERVISOR]: [BranchTypeEnum.SUPERMARKET],
  [CompanyRoleEnum.INVENTORY_MANAGER]: [
    BranchTypeEnum.SUPERMARKET,
    BranchTypeEnum.RESTAURANT,
  ],
  [CompanyRoleEnum.CASHIER]: [BranchTypeEnum.SUPERMARKET],
  [CompanyRoleEnum.STOCK_CLERK]: [BranchTypeEnum.SUPERMARKET],
  [CompanyRoleEnum.DELI_WORKER]: [BranchTypeEnum.SUPERMARKET],
  [CompanyRoleEnum.BAKERY_STAFF]: [BranchTypeEnum.SUPERMARKET],
};
