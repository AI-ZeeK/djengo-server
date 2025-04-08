import {
  CompanyHierarchyLevelEnum,
  CompanyRoleEnum,
  BranchTypeEnum,
  CompanyHierarchyLevelMap,
  CompanyRoleManagerMap,
  RoleToBranchTypeMap,
} from '../enums/hierarchy.enum';

// Company hierarchy levels with their properties
export const COMPANY_HIERARCHY_LEVELS = Object.entries(
  CompanyHierarchyLevelEnum,
).map(([key, value]) => ({
  level_name: value,
  level_number: CompanyHierarchyLevelMap[value],
}));

// Company roles with their properties
export const COMPANY_ROLES = Object.entries(CompanyRoleEnum).map(
  ([key, value]) => ({
    role_name: value,
    is_manager: CompanyRoleManagerMap[value],
    applicable_branch_types: RoleToBranchTypeMap[value],
  }),
);

// Define reporting relationships for company hierarchy
export const COMPANY_HIERARCHY_REPORTING = [
  // Level 2 reports to CEO
  { from: CompanyHierarchyLevelEnum.COO, to: CompanyHierarchyLevelEnum.CEO },
  { from: CompanyHierarchyLevelEnum.CFO, to: CompanyHierarchyLevelEnum.CEO },
  { from: CompanyHierarchyLevelEnum.CIO, to: CompanyHierarchyLevelEnum.CEO },

  // Level 3 reports to appropriate Level 2
  {
    from: CompanyHierarchyLevelEnum.VP_HOSPITALITY,
    to: CompanyHierarchyLevelEnum.COO,
  },
  {
    from: CompanyHierarchyLevelEnum.VP_RETAIL,
    to: CompanyHierarchyLevelEnum.COO,
  },
  {
    from: CompanyHierarchyLevelEnum.VP_FINANCE,
    to: CompanyHierarchyLevelEnum.CFO,
  },
  {
    from: CompanyHierarchyLevelEnum.VP_MARKETING,
    to: CompanyHierarchyLevelEnum.COO,
  },

  // Level 4 reports to appropriate Level 3
  {
    from: CompanyHierarchyLevelEnum.REGIONAL_DIRECTOR,
    to: CompanyHierarchyLevelEnum.VP_HOSPITALITY,
  },

  // Level 5 reports to Regional Director
  {
    from: CompanyHierarchyLevelEnum.DISTRICT_MANAGER,
    to: CompanyHierarchyLevelEnum.REGIONAL_DIRECTOR,
  },

  // Level 6 reports to District Manager
  {
    from: CompanyHierarchyLevelEnum.PROPERTY_MANAGER,
    to: CompanyHierarchyLevelEnum.DISTRICT_MANAGER,
  },
];

// Define reporting relationships for company roles by branch type
export const COMPANY_ROLE_REPORTING = {
  // Hotel reporting structure
  [BranchTypeEnum.HOTEL]: [
    { from: CompanyRoleEnum.GENERAL_MANAGER, to: CompanyRoleEnum.DIRECTOR },
    {
      from: CompanyRoleEnum.FRONT_DESK_MANAGER,
      to: CompanyRoleEnum.GENERAL_MANAGER,
    },
    {
      from: CompanyRoleEnum.HOUSEKEEPING_MANAGER,
      to: CompanyRoleEnum.GENERAL_MANAGER,
    },
    {
      from: CompanyRoleEnum.FRONT_DESK_AGENT,
      to: CompanyRoleEnum.FRONT_DESK_MANAGER,
    },
    { from: CompanyRoleEnum.CONCIERGE, to: CompanyRoleEnum.FRONT_DESK_MANAGER },
    {
      from: CompanyRoleEnum.HOUSEKEEPING_STAFF,
      to: CompanyRoleEnum.HOUSEKEEPING_MANAGER,
    },
    {
      from: CompanyRoleEnum.MAINTENANCE_STAFF,
      to: CompanyRoleEnum.GENERAL_MANAGER,
    },
  ],

  // Restaurant reporting structure
  [BranchTypeEnum.RESTAURANT]: [
    { from: CompanyRoleEnum.RESTAURANT_MANAGER, to: CompanyRoleEnum.DIRECTOR },
    { from: CompanyRoleEnum.HEAD_CHEF, to: CompanyRoleEnum.RESTAURANT_MANAGER },
    { from: CompanyRoleEnum.SOUS_CHEF, to: CompanyRoleEnum.HEAD_CHEF },
    { from: CompanyRoleEnum.LINE_COOK, to: CompanyRoleEnum.SOUS_CHEF },
    { from: CompanyRoleEnum.HOST, to: CompanyRoleEnum.RESTAURANT_MANAGER },
    { from: CompanyRoleEnum.SERVER, to: CompanyRoleEnum.RESTAURANT_MANAGER },
    { from: CompanyRoleEnum.BARTENDER, to: CompanyRoleEnum.RESTAURANT_MANAGER },
    {
      from: CompanyRoleEnum.INVENTORY_MANAGER,
      to: CompanyRoleEnum.RESTAURANT_MANAGER,
    },
  ],

  // Supermarket reporting structure
  [BranchTypeEnum.SUPERMARKET]: [
    { from: CompanyRoleEnum.STORE_MANAGER, to: CompanyRoleEnum.DIRECTOR },
    {
      from: CompanyRoleEnum.DEPARTMENT_SUPERVISOR,
      to: CompanyRoleEnum.STORE_MANAGER,
    },
    {
      from: CompanyRoleEnum.CASHIER_SUPERVISOR,
      to: CompanyRoleEnum.STORE_MANAGER,
    },
    {
      from: CompanyRoleEnum.INVENTORY_MANAGER,
      to: CompanyRoleEnum.STORE_MANAGER,
    },
    { from: CompanyRoleEnum.CASHIER, to: CompanyRoleEnum.CASHIER_SUPERVISOR },
    {
      from: CompanyRoleEnum.STOCK_CLERK,
      to: CompanyRoleEnum.INVENTORY_MANAGER,
    },
    {
      from: CompanyRoleEnum.DELI_WORKER,
      to: CompanyRoleEnum.DEPARTMENT_SUPERVISOR,
    },
    {
      from: CompanyRoleEnum.BAKERY_STAFF,
      to: CompanyRoleEnum.DEPARTMENT_SUPERVISOR,
    },
  ],

  // Corporate office reporting structure
  [BranchTypeEnum.CORPORATE_OFFICE]: [
    { from: CompanyRoleEnum.DIRECTOR, to: CompanyRoleEnum.EXECUTIVE },
    { from: CompanyRoleEnum.MANAGER, to: CompanyRoleEnum.DIRECTOR },
    { from: CompanyRoleEnum.SUPERVISOR, to: CompanyRoleEnum.MANAGER },
    { from: CompanyRoleEnum.SPECIALIST, to: CompanyRoleEnum.MANAGER },
    { from: CompanyRoleEnum.COORDINATOR, to: CompanyRoleEnum.MANAGER },
    { from: CompanyRoleEnum.ANALYST, to: CompanyRoleEnum.MANAGER },
    { from: CompanyRoleEnum.ASSISTANT, to: CompanyRoleEnum.MANAGER },
  ],
};

// Define which roles are available for each branch type
export const BRANCH_TYPE_AVAILABLE_ROLES = {
  [BranchTypeEnum.HOTEL]: [
    CompanyRoleEnum.GENERAL_MANAGER,
    CompanyRoleEnum.FRONT_DESK_MANAGER,
    CompanyRoleEnum.HOUSEKEEPING_MANAGER,
    CompanyRoleEnum.CONCIERGE,
    CompanyRoleEnum.FRONT_DESK_AGENT,
    CompanyRoleEnum.HOUSEKEEPING_STAFF,
    CompanyRoleEnum.MAINTENANCE_STAFF,
    CompanyRoleEnum.MANAGER,
    CompanyRoleEnum.SUPERVISOR,
    CompanyRoleEnum.ASSISTANT,
  ],

  [BranchTypeEnum.RESTAURANT]: [
    CompanyRoleEnum.RESTAURANT_MANAGER,
    CompanyRoleEnum.HEAD_CHEF,
    CompanyRoleEnum.SOUS_CHEF,
    CompanyRoleEnum.LINE_COOK,
    CompanyRoleEnum.HOST,
    CompanyRoleEnum.SERVER,
    CompanyRoleEnum.BARTENDER,
    CompanyRoleEnum.INVENTORY_MANAGER,
    CompanyRoleEnum.MAINTENANCE_STAFF,
    CompanyRoleEnum.MANAGER,
    CompanyRoleEnum.SUPERVISOR,
    CompanyRoleEnum.ASSISTANT,
  ],

  [BranchTypeEnum.SUPERMARKET]: [
    CompanyRoleEnum.STORE_MANAGER,
    CompanyRoleEnum.DEPARTMENT_SUPERVISOR,
    CompanyRoleEnum.CASHIER_SUPERVISOR,
    CompanyRoleEnum.INVENTORY_MANAGER,
    CompanyRoleEnum.CASHIER,
    CompanyRoleEnum.STOCK_CLERK,
    CompanyRoleEnum.DELI_WORKER,
    CompanyRoleEnum.BAKERY_STAFF,
    CompanyRoleEnum.MAINTENANCE_STAFF,
    CompanyRoleEnum.MANAGER,
    CompanyRoleEnum.SUPERVISOR,
    CompanyRoleEnum.ASSISTANT,
  ],

  [BranchTypeEnum.CORPORATE_OFFICE]: [
    CompanyRoleEnum.EXECUTIVE,
    CompanyRoleEnum.DIRECTOR,
    CompanyRoleEnum.MANAGER,
    CompanyRoleEnum.SUPERVISOR,
    CompanyRoleEnum.SPECIALIST,
    CompanyRoleEnum.COORDINATOR,
    CompanyRoleEnum.ANALYST,
    CompanyRoleEnum.ASSISTANT,
  ],
};
