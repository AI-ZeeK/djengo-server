import { CompanyHierarchyLevelEnum, CompanyRoleEnum, BranchTypeEnum } from '../enums/hierarchy.enum';
export declare const COMPANY_HIERARCHY_LEVELS: {
    level_name: CompanyHierarchyLevelEnum;
    level_number: number;
}[];
export declare const COMPANY_ROLES: {
    role_name: CompanyRoleEnum;
    is_manager: boolean;
    applicable_branch_types: BranchTypeEnum[];
}[];
export declare const COMPANY_HIERARCHY_REPORTING: {
    from: CompanyHierarchyLevelEnum;
    to: CompanyHierarchyLevelEnum;
}[];
export declare const COMPANY_ROLE_REPORTING: {
    Hotel: {
        from: CompanyRoleEnum;
        to: CompanyRoleEnum;
    }[];
    Restaurant: {
        from: CompanyRoleEnum;
        to: CompanyRoleEnum;
    }[];
    Supermarket: {
        from: CompanyRoleEnum;
        to: CompanyRoleEnum;
    }[];
    "Corporate Office": {
        from: CompanyRoleEnum;
        to: CompanyRoleEnum;
    }[];
};
export declare const BRANCH_TYPE_AVAILABLE_ROLES: {
    Hotel: CompanyRoleEnum[];
    Restaurant: CompanyRoleEnum[];
    Supermarket: CompanyRoleEnum[];
    "Corporate Office": CompanyRoleEnum[];
};
