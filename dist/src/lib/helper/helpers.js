"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = void 0;
class Helpers {
    static generateOTP({ length = 5, options = {
        numbers: true,
        uppercase: false,
        lowercase: false,
    }, }) {
        const { numbers, uppercase, lowercase } = options;
        let characters = '';
        if (numbers)
            characters += '0123456789';
        if (uppercase)
            characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowercase)
            characters += 'abcdefghijklmnopqrstuvwxyz';
        if (!characters) {
            throw new Error('At least one character type must be enabled.');
        }
        let otp = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            otp += characters[randomIndex];
        }
        return otp;
    }
    static getFutureTimestamp({ seconds }) {
        const now = new Date();
        return new Date(now.getTime() + seconds * 1000);
    }
    static generateUniqueValue(value) {
        const prefix = value.slice(0, 3).toUpperCase();
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%&';
        let randomSuffix = '';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomSuffix += characters[randomIndex];
        }
        return `${prefix}-${randomSuffix}`;
    }
}
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map