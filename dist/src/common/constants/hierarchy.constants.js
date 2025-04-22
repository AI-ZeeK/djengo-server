"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRANCH_TYPE_AVAILABLE_ROLES = exports.COMPANY_ROLE_REPORTING = exports.COMPANY_HIERARCHY_REPORTING = exports.COMPANY_ROLES = exports.COMPANY_HIERARCHY_LEVELS = void 0;
const hierarchy_enum_1 = require("../enums/hierarchy.enum");
exports.COMPANY_HIERARCHY_LEVELS = Object.entries(hierarchy_enum_1.CompanyHierarchyLevelEnum).map(([key, value]) => ({
    level_name: value,
    level_number: hierarchy_enum_1.CompanyHierarchyLevelMap[value],
}));
exports.COMPANY_ROLES = Object.entries(hierarchy_enum_1.CompanyRoleEnum).map(([key, value]) => ({
    role_name: value,
    is_manager: hierarchy_enum_1.CompanyRoleManagerMap[value],
    applicable_branch_types: hierarchy_enum_1.RoleToBranchTypeMap[value],
}));
exports.COMPANY_HIERARCHY_REPORTING = [
    { from: hierarchy_enum_1.CompanyHierarchyLevelEnum.COO, to: hierarchy_enum_1.CompanyHierarchyLevelEnum.CEO },
    { from: hierarchy_enum_1.CompanyHierarchyLevelEnum.CFO, to: hierarchy_enum_1.CompanyHierarchyLevelEnum.CEO },
    { from: hierarchy_enum_1.CompanyHierarchyLevelEnum.CIO, to: hierarchy_enum_1.CompanyHierarchyLevelEnum.CEO },
    {
        from: hierarchy_enum_1.CompanyHierarchyLevelEnum.VP_HOSPITALITY,
        to: hierarchy_enum_1.CompanyHierarchyLevelEnum.COO,
    },
    {
        from: hierarchy_enum_1.CompanyHierarchyLevelEnum.VP_RETAIL,
        to: hierarchy_enum_1.CompanyHierarchyLevelEnum.COO,
    },
    {
        from: hierarchy_enum_1.CompanyHierarchyLevelEnum.VP_FINANCE,
        to: hierarchy_enum_1.CompanyHierarchyLevelEnum.CFO,
    },
    {
        from: hierarchy_enum_1.CompanyHierarchyLevelEnum.VP_MARKETING,
        to: hierarchy_enum_1.CompanyHierarchyLevelEnum.COO,
    },
    {
        from: hierarchy_enum_1.CompanyHierarchyLevelEnum.REGIONAL_DIRECTOR,
        to: hierarchy_enum_1.CompanyHierarchyLevelEnum.VP_HOSPITALITY,
    },
    {
        from: hierarchy_enum_1.CompanyHierarchyLevelEnum.DISTRICT_MANAGER,
        to: hierarchy_enum_1.CompanyHierarchyLevelEnum.REGIONAL_DIRECTOR,
    },
    {
        from: hierarchy_enum_1.CompanyHierarchyLevelEnum.PROPERTY_MANAGER,
        to: hierarchy_enum_1.CompanyHierarchyLevelEnum.DISTRICT_MANAGER,
    },
];
exports.COMPANY_ROLE_REPORTING = {
    [hierarchy_enum_1.BranchTypeEnum.HOTEL]: [
        { from: hierarchy_enum_1.CompanyRoleEnum.GENERAL_MANAGER, to: hierarchy_enum_1.CompanyRoleEnum.DIRECTOR },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.FRONT_DESK_MANAGER,
            to: hierarchy_enum_1.CompanyRoleEnum.GENERAL_MANAGER,
        },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.HOUSEKEEPING_MANAGER,
            to: hierarchy_enum_1.CompanyRoleEnum.GENERAL_MANAGER,
        },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.FRONT_DESK_AGENT,
            to: hierarchy_enum_1.CompanyRoleEnum.FRONT_DESK_MANAGER,
        },
        { from: hierarchy_enum_1.CompanyRoleEnum.CONCIERGE, to: hierarchy_enum_1.CompanyRoleEnum.FRONT_DESK_MANAGER },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.HOUSEKEEPING_STAFF,
            to: hierarchy_enum_1.CompanyRoleEnum.HOUSEKEEPING_MANAGER,
        },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.MAINTENANCE_STAFF,
            to: hierarchy_enum_1.CompanyRoleEnum.GENERAL_MANAGER,
        },
    ],
    [hierarchy_enum_1.BranchTypeEnum.RESTAURANT]: [
        { from: hierarchy_enum_1.CompanyRoleEnum.RESTAURANT_MANAGER, to: hierarchy_enum_1.CompanyRoleEnum.DIRECTOR },
        { from: hierarchy_enum_1.CompanyRoleEnum.HEAD_CHEF, to: hierarchy_enum_1.CompanyRoleEnum.RESTAURANT_MANAGER },
        { from: hierarchy_enum_1.CompanyRoleEnum.SOUS_CHEF, to: hierarchy_enum_1.CompanyRoleEnum.HEAD_CHEF },
        { from: hierarchy_enum_1.CompanyRoleEnum.LINE_COOK, to: hierarchy_enum_1.CompanyRoleEnum.SOUS_CHEF },
        { from: hierarchy_enum_1.CompanyRoleEnum.HOST, to: hierarchy_enum_1.CompanyRoleEnum.RESTAURANT_MANAGER },
        { from: hierarchy_enum_1.CompanyRoleEnum.SERVER, to: hierarchy_enum_1.CompanyRoleEnum.RESTAURANT_MANAGER },
        { from: hierarchy_enum_1.CompanyRoleEnum.BARTENDER, to: hierarchy_enum_1.CompanyRoleEnum.RESTAURANT_MANAGER },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.INVENTORY_MANAGER,
            to: hierarchy_enum_1.CompanyRoleEnum.RESTAURANT_MANAGER,
        },
    ],
    [hierarchy_enum_1.BranchTypeEnum.SUPERMARKET]: [
        { from: hierarchy_enum_1.CompanyRoleEnum.STORE_MANAGER, to: hierarchy_enum_1.CompanyRoleEnum.DIRECTOR },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.DEPARTMENT_SUPERVISOR,
            to: hierarchy_enum_1.CompanyRoleEnum.STORE_MANAGER,
        },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.CASHIER_SUPERVISOR,
            to: hierarchy_enum_1.CompanyRoleEnum.STORE_MANAGER,
        },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.INVENTORY_MANAGER,
            to: hierarchy_enum_1.CompanyRoleEnum.STORE_MANAGER,
        },
        { from: hierarchy_enum_1.CompanyRoleEnum.CASHIER, to: hierarchy_enum_1.CompanyRoleEnum.CASHIER_SUPERVISOR },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.STOCK_CLERK,
            to: hierarchy_enum_1.CompanyRoleEnum.INVENTORY_MANAGER,
        },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.DELI_WORKER,
            to: hierarchy_enum_1.CompanyRoleEnum.DEPARTMENT_SUPERVISOR,
        },
        {
            from: hierarchy_enum_1.CompanyRoleEnum.BAKERY_STAFF,
            to: hierarchy_enum_1.CompanyRoleEnum.DEPARTMENT_SUPERVISOR,
        },
    ],
    [hierarchy_enum_1.BranchTypeEnum.CORPORATE_OFFICE]: [
        { from: hierarchy_enum_1.CompanyRoleEnum.DIRECTOR, to: hierarchy_enum_1.CompanyRoleEnum.EXECUTIVE },
        { from: hierarchy_enum_1.CompanyRoleEnum.MANAGER, to: hierarchy_enum_1.CompanyRoleEnum.DIRECTOR },
        { from: hierarchy_enum_1.CompanyRoleEnum.SUPERVISOR, to: hierarchy_enum_1.CompanyRoleEnum.MANAGER },
        { from: hierarchy_enum_1.CompanyRoleEnum.SPECIALIST, to: hierarchy_enum_1.CompanyRoleEnum.MANAGER },
        { from: hierarchy_enum_1.CompanyRoleEnum.COORDINATOR, to: hierarchy_enum_1.CompanyRoleEnum.MANAGER },
        { from: hierarchy_enum_1.CompanyRoleEnum.ANALYST, to: hierarchy_enum_1.CompanyRoleEnum.MANAGER },
        { from: hierarchy_enum_1.CompanyRoleEnum.ASSISTANT, to: hierarchy_enum_1.CompanyRoleEnum.MANAGER },
    ],
};
exports.BRANCH_TYPE_AVAILABLE_ROLES = {
    [hierarchy_enum_1.BranchTypeEnum.HOTEL]: [
        hierarchy_enum_1.CompanyRoleEnum.GENERAL_MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.FRONT_DESK_MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.HOUSEKEEPING_MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.CONCIERGE,
        hierarchy_enum_1.CompanyRoleEnum.FRONT_DESK_AGENT,
        hierarchy_enum_1.CompanyRoleEnum.HOUSEKEEPING_STAFF,
        hierarchy_enum_1.CompanyRoleEnum.MAINTENANCE_STAFF,
        hierarchy_enum_1.CompanyRoleEnum.MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.SUPERVISOR,
        hierarchy_enum_1.CompanyRoleEnum.ASSISTANT,
    ],
    [hierarchy_enum_1.BranchTypeEnum.RESTAURANT]: [
        hierarchy_enum_1.CompanyRoleEnum.RESTAURANT_MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.HEAD_CHEF,
        hierarchy_enum_1.CompanyRoleEnum.SOUS_CHEF,
        hierarchy_enum_1.CompanyRoleEnum.LINE_COOK,
        hierarchy_enum_1.CompanyRoleEnum.HOST,
        hierarchy_enum_1.CompanyRoleEnum.SERVER,
        hierarchy_enum_1.CompanyRoleEnum.BARTENDER,
        hierarchy_enum_1.CompanyRoleEnum.INVENTORY_MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.MAINTENANCE_STAFF,
        hierarchy_enum_1.CompanyRoleEnum.MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.SUPERVISOR,
        hierarchy_enum_1.CompanyRoleEnum.ASSISTANT,
    ],
    [hierarchy_enum_1.BranchTypeEnum.SUPERMARKET]: [
        hierarchy_enum_1.CompanyRoleEnum.STORE_MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.DEPARTMENT_SUPERVISOR,
        hierarchy_enum_1.CompanyRoleEnum.CASHIER_SUPERVISOR,
        hierarchy_enum_1.CompanyRoleEnum.INVENTORY_MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.CASHIER,
        hierarchy_enum_1.CompanyRoleEnum.STOCK_CLERK,
        hierarchy_enum_1.CompanyRoleEnum.DELI_WORKER,
        hierarchy_enum_1.CompanyRoleEnum.BAKERY_STAFF,
        hierarchy_enum_1.CompanyRoleEnum.MAINTENANCE_STAFF,
        hierarchy_enum_1.CompanyRoleEnum.MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.SUPERVISOR,
        hierarchy_enum_1.CompanyRoleEnum.ASSISTANT,
    ],
    [hierarchy_enum_1.BranchTypeEnum.CORPORATE_OFFICE]: [
        hierarchy_enum_1.CompanyRoleEnum.EXECUTIVE,
        hierarchy_enum_1.CompanyRoleEnum.DIRECTOR,
        hierarchy_enum_1.CompanyRoleEnum.MANAGER,
        hierarchy_enum_1.CompanyRoleEnum.SUPERVISOR,
        hierarchy_enum_1.CompanyRoleEnum.SPECIALIST,
        hierarchy_enum_1.CompanyRoleEnum.COORDINATOR,
        hierarchy_enum_1.CompanyRoleEnum.ANALYST,
        hierarchy_enum_1.CompanyRoleEnum.ASSISTANT,
    ],
};
//# sourceMappingURL=hierarchy.constants.js.map