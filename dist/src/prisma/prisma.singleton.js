"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const prisma_main_1 = require("@internal/prisma-main");
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new prisma_main_1.PrismaClient({});
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
//# sourceMappingURL=prisma.singleton.js.map