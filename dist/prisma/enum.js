"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE_ENTITY_TYPE_ENUM = exports.ADDRESS_TYPE_ENUM = exports.ROLES_ENUM = void 0;
var ROLES_ENUM;
(function (ROLES_ENUM) {
    ROLES_ENUM["PLATFORM_USER"] = "PLATFORM_USER";
    ROLES_ENUM["BUSINESS_USER"] = "BUSINESS_USER";
    ROLES_ENUM["PLATFORM"] = "PLATFORM";
    ROLES_ENUM["CLIENT"] = "CLIENT";
    ROLES_ENUM["COMPANY"] = "COMPANY";
    ROLES_ENUM["BRANCH"] = "BRANCH";
    ROLES_ENUM["STAFF"] = "STAFF";
    ROLES_ENUM["AGENCY"] = "AGENCY";
})(ROLES_ENUM || (exports.ROLES_ENUM = ROLES_ENUM = {}));
var ADDRESS_TYPE_ENUM;
(function (ADDRESS_TYPE_ENUM) {
    ADDRESS_TYPE_ENUM["USER_HOME"] = "user_home";
    ADDRESS_TYPE_ENUM["USER_WORK"] = "user_work";
    ADDRESS_TYPE_ENUM["BUSINESS_PRIMARY"] = "business_primary";
    ADDRESS_TYPE_ENUM["BUSINESS_BRANCH"] = "business_branch";
    ADDRESS_TYPE_ENUM["PROFI_SERVICE_AREA"] = "profi_service_area";
    ADDRESS_TYPE_ENUM["ORDER_DELIVERY"] = "order_delivery";
    ADDRESS_TYPE_ENUM["TRAINING_VENUE"] = "training_venue";
    ADDRESS_TYPE_ENUM["INSTRUCTOR_LOCATION"] = "instructor_location";
    ADDRESS_TYPE_ENUM["BILLING_ADDRESS"] = "billing_address";
    ADDRESS_TYPE_ENUM["BANK_BRANCH"] = "bank_branch";
    ADDRESS_TYPE_ENUM["MANUFACTURER_LOCATION"] = "manufacturer_location";
    ADDRESS_TYPE_ENUM["SUPPLIER_LOCATION"] = "supplier_location";
    ADDRESS_TYPE_ENUM["WAREHOUSE_LOCATION"] = "warehouse_location";
    ADDRESS_TYPE_ENUM["STORAGE_LOCATION"] = "storage_location";
    ADDRESS_TYPE_ENUM["CREATED_CLIENT"] = "created_client";
})(ADDRESS_TYPE_ENUM || (exports.ADDRESS_TYPE_ENUM = ADDRESS_TYPE_ENUM = {}));
var FILE_ENTITY_TYPE_ENUM;
(function (FILE_ENTITY_TYPE_ENUM) {
    FILE_ENTITY_TYPE_ENUM["USER_AVATAR"] = "user_avatar";
    FILE_ENTITY_TYPE_ENUM["BUSINESS_LOGO"] = "business_logo";
})(FILE_ENTITY_TYPE_ENUM || (exports.FILE_ENTITY_TYPE_ENUM = FILE_ENTITY_TYPE_ENUM = {}));
//# sourceMappingURL=enum.js.map