export interface DPMS_PL_ISSUE_PK {
    VPROD: string;
    VP: string;
    VTYPE: string;
    VORDERS: string;
}

export interface generatePDFParams {
    order: string;
    html: string;
    fileName: string;
    revision: string;
    issueDate: string;
    finalPath: string;
}

export interface sendMailContext {
    rev: string;
    issueType: string;
    shopOrderNo: string;
    subject: string;
    nameOfBldg: string;
    soldTo: string;
    path: string;
}

export interface sendMailParams {
    maillist: string[];
    context: sendMailContext;
    attachments: { filename: string; content: Buffer }[];
    subject?: string;
}
