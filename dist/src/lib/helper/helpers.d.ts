export declare class Helpers {
    static generateOTP({ length, options, }: {
        length: number;
        options: {
            numbers: boolean;
            uppercase?: boolean;
            lowercase?: boolean;
        };
    }): string;
    static getFutureTimestamp({ seconds }: {
        seconds: number;
    }): Date;
    static generateUniqueValue(value: string): string;
}
