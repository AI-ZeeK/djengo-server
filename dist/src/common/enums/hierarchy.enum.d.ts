export declare enum CompanyHierarchyLevelEnum {
    CEO = "CEO",
    COO = "COO",
    CFO = "CFO",
    CIO = "CIO",
    VP_HOSPITALITY = "VP Hospitality",
    VP_RETAIL = "VP Retail",
    VP_FINANCE = "VP Finance",
    VP_MARKETING = "VP Marketing",
    REGIONAL_DIRECTOR = "Regional Director",
    DISTRICT_MANAGER = "District Manager",
    PROPERTY_MANAGER = "Property Manager"
}
export declare enum CompanyRoleEnum {
    EXECUTIVE = "Executive",
    DIRECTOR = "Director",
    MANAGER = "Manager",
    SUPERVISOR = "Supervisor",
    SPECIALIST = "Specialist",
    COORDINATOR = "Coordinator",
    ANALYST = "Analyst",
    ASSISTANT = "Assistant",
    GENERAL_MANAGER = "General Manager",
    FRONT_DESK_MANAGER = "Front Desk Manager",
    HOUSEKEEPING_MANAGER = "Housekeeping Manager",
    CONCIERGE = "Concierge",
    FRONT_DESK_AGENT = "Front Desk Agent",
    HOUSEKEEPING_STAFF = "Housekeeping Staff",
    MAINTENANCE_STAFF = "Maintenance Staff",
    RESTAURANT_MANAGER = "Restaurant Manager",
    HEAD_CHEF = "Head Chef",
    SOUS_CHEF = "Sous Chef",
    LINE_COOK = "Line Cook",
    HOST = "Host/Hostess",
    SERVER = "Server",
    BARTENDER = "Bartender",
    STORE_MANAGER = "Store Manager",
    DEPARTMENT_SUPERVISOR = "Department Supervisor",
    CASHIER_SUPERVISOR = "Cashier Supervisor",
    INVENTORY_MANAGER = "Inventory Manager",
    CASHIER = "Cashier",
    STOCK_CLERK = "Stock Clerk",
    DELI_WORKER = "Deli Worker",
    BAKERY_STAFF = "Bakery Staff"
}
export declare enum BranchTypeEnum {
    HOTEL = "Hotel",
    RESTAURANT = "Restaurant",
    SUPERMARKET = "Supermarket",
    CORPORATE_OFFICE = "Corporate Office"
}
export declare const CompanyHierarchyLevelMap: Record<CompanyHierarchyLevelEnum, number>;
export declare const CompanyRoleManagerMap: Record<CompanyRoleEnum, boolean>;
export declare const RoleToBranchTypeMap: Record<CompanyRoleEnum, BranchTypeEnum[]>;
