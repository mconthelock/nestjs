export interface sendMailParams {
    attachments: { filename: string; content: Buffer }[];
    vanDate: Date;
}
