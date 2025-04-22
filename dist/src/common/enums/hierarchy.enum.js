"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleToBranchTypeMap = exports.CompanyRoleManagerMap = exports.CompanyHierarchyLevelMap = exports.BranchTypeEnum = exports.CompanyRoleEnum = exports.CompanyHierarchyLevelEnum = void 0;
var CompanyHierarchyLevelEnum;
(function (CompanyHierarchyLevelEnum) {
    CompanyHierarchyLevelEnum["CEO"] = "CEO";
    CompanyHierarchyLevelEnum["COO"] = "COO";
    CompanyHierarchyLevelEnum["CFO"] = "CFO";
    CompanyHierarchyLevelEnum["CIO"] = "CIO";
    CompanyHierarchyLevelEnum["VP_HOSPITALITY"] = "VP Hospitality";
    CompanyHierarchyLevelEnum["VP_RETAIL"] = "VP Retail";
    CompanyHierarchyLevelEnum["VP_FINANCE"] = "VP Finance";
    CompanyHierarchyLevelEnum["VP_MARKETING"] = "VP Marketing";
    CompanyHierarchyLevelEnum["REGIONAL_DIRECTOR"] = "Regional Director";
    CompanyHierarchyLevelEnum["DISTRICT_MANAGER"] = "District Manager";
    CompanyHierarchyLevelEnum["PROPERTY_MANAGER"] = "Property Manager";
})(CompanyHierarchyLevelEnum || (exports.CompanyHierarchyLevelEnum = CompanyHierarchyLevelEnum = {}));
var CompanyRoleEnum;
(function (CompanyRoleEnum) {
    CompanyRoleEnum["EXECUTIVE"] = "Executive";
    CompanyRoleEnum["DIRECTOR"] = "Director";
    CompanyRoleEnum["MANAGER"] = "Manager";
    CompanyRoleEnum["SUPERVISOR"] = "Supervisor";
    CompanyRoleEnum["SPECIALIST"] = "Specialist";
    CompanyRoleEnum["COORDINATOR"] = "Coordinator";
    CompanyRoleEnum["ANALYST"] = "Analyst";
    CompanyRoleEnum["ASSISTANT"] = "Assistant";
    CompanyRoleEnum["GENERAL_MANAGER"] = "General Manager";
    CompanyRoleEnum["FRONT_DESK_MANAGER"] = "Front Desk Manager";
    CompanyRoleEnum["HOUSEKEEPING_MANAGER"] = "Housekeeping Manager";
    CompanyRoleEnum["CONCIERGE"] = "Concierge";
    CompanyRoleEnum["FRONT_DESK_AGENT"] = "Front Desk Agent";
    CompanyRoleEnum["HOUSEKEEPING_STAFF"] = "Housekeeping Staff";
    CompanyRoleEnum["MAINTENANCE_STAFF"] = "Maintenance Staff";
    CompanyRoleEnum["RESTAURANT_MANAGER"] = "Restaurant Manager";
    CompanyRoleEnum["HEAD_CHEF"] = "Head Chef";
    CompanyRoleEnum["SOUS_CHEF"] = "Sous Chef";
    CompanyRoleEnum["LINE_COOK"] = "Line Cook";
    CompanyRoleEnum["HOST"] = "Host/Hostess";
    CompanyRoleEnum["SERVER"] = "Server";
    CompanyRoleEnum["BARTENDER"] = "Bartender";
    CompanyRoleEnum["STORE_MANAGER"] = "Store Manager";
    CompanyRoleEnum["DEPARTMENT_SUPERVISOR"] = "Department Supervisor";
    CompanyRoleEnum["CASHIER_SUPERVISOR"] = "Cashier Supervisor";
    CompanyRoleEnum["INVENTORY_MANAGER"] = "Inventory Manager";
    CompanyRoleEnum["CASHIER"] = "Cashier";
    CompanyRoleEnum["STOCK_CLERK"] = "Stock Clerk";
    CompanyRoleEnum["DELI_WORKER"] = "Deli Worker";
    CompanyRoleEnum["BAKERY_STAFF"] = "Bakery Staff";
})(CompanyRoleEnum || (exports.CompanyRoleEnum = CompanyRoleEnum = {}));
var BranchTypeEnum;
(function (BranchTypeEnum) {
    BranchTypeEnum["HOTEL"] = "Hotel";
    BranchTypeEnum["RESTAURANT"] = "Restaurant";
    BranchTypeEnum["SUPERMARKET"] = "Supermarket";
    BranchTypeEnum["CORPORATE_OFFICE"] = "Corporate Office";
})(BranchTypeEnum || (exports.BranchTypeEnum = BranchTypeEnum = {}));
exports.CompanyHierarchyLevelMap = {
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
exports.CompanyRoleManagerMap = {
    [CompanyRoleEnum.EXECUTIVE]: true,
    [CompanyRoleEnum.DIRECTOR]: true,
    [CompanyRoleEnum.MANAGER]: true,
    [CompanyRoleEnum.SUPERVISOR]: true,
    [CompanyRoleEnum.SPECIALIST]: false,
    [CompanyRoleEnum.COORDINATOR]: false,
    [CompanyRoleEnum.ANALYST]: false,
    [CompanyRoleEnum.ASSISTANT]: false,
    [CompanyRoleEnum.GENERAL_MANAGER]: true,
    [CompanyRoleEnum.FRONT_DESK_MANAGER]: true,
    [CompanyRoleEnum.HOUSEKEEPING_MANAGER]: true,
    [CompanyRoleEnum.CONCIERGE]: false,
    [CompanyRoleEnum.FRONT_DESK_AGENT]: false,
    [CompanyRoleEnum.HOUSEKEEPING_STAFF]: false,
    [CompanyRoleEnum.MAINTENANCE_STAFF]: false,
    [CompanyRoleEnum.RESTAURANT_MANAGER]: true,
    [CompanyRoleEnum.HEAD_CHEF]: true,
    [CompanyRoleEnum.SOUS_CHEF]: true,
    [CompanyRoleEnum.LINE_COOK]: false,
    [CompanyRoleEnum.HOST]: false,
    [CompanyRoleEnum.SERVER]: false,
    [CompanyRoleEnum.BARTENDER]: false,
    [CompanyRoleEnum.STORE_MANAGER]: true,
    [CompanyRoleEnum.DEPARTMENT_SUPERVISOR]: true,
    [CompanyRoleEnum.CASHIER_SUPERVISOR]: true,
    [CompanyRoleEnum.INVENTORY_MANAGER]: true,
    [CompanyRoleEnum.CASHIER]: false,
    [CompanyRoleEnum.STOCK_CLERK]: false,
    [CompanyRoleEnum.DELI_WORKER]: false,
    [CompanyRoleEnum.BAKERY_STAFF]: false,
};
exports.RoleToBranchTypeMap = {
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
    [CompanyRoleEnum.RESTAURANT_MANAGER]: [BranchTypeEnum.RESTAURANT],
    [CompanyRoleEnum.HEAD_CHEF]: [BranchTypeEnum.RESTAURANT],
    [CompanyRoleEnum.SOUS_CHEF]: [BranchTypeEnum.RESTAURANT],
    [CompanyRoleEnum.LINE_COOK]: [BranchTypeEnum.RESTAURANT],
    [CompanyRoleEnum.HOST]: [BranchTypeEnum.RESTAURANT],
    [CompanyRoleEnum.SERVER]: [BranchTypeEnum.RESTAURANT],
    [CompanyRoleEnum.BARTENDER]: [BranchTypeEnum.RESTAURANT],
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
//# sourceMappingURL=hierarchy.enum.js.map