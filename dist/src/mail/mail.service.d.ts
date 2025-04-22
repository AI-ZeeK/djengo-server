export declare class MailService {
    private transporter;
    constructor();
    private loadTemplate;
    sendBusinessOtpEmail({ email, name, otp, }: {
        email: string;
        name: string;
        otp: string;
    }): Promise<void>;
}
