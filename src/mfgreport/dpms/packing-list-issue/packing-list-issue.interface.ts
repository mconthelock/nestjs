export interface DPMS_PL_ISSUE_PK {
    VPROD: string;
    VP: string;
    VTYPE: string;
    VORDERS: string;
}

export interface getPendingRecordParams extends DPMS_PL_ISSUE_PK {
    NREV: number;
}

export interface findPreviousRevisionExcludingIssueRevParams extends getPendingRecordParams {
    NISSUEREV_ID: number;
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

export interface prepareDocRevisionDataParams {
    typeCode: string;
    plIssueData: DPMS_PL_ISSUE_PK;
    finishDate: Date;
    docRevision: number;
    revise: boolean;
    recreatedIssue: boolean;
}

export interface generateFilenameParams {
    revision: number;
    revisionText: string;
    issueType: string;
    orders: string;
    projectName: string;
}

export interface syncDocRevisionAndPlIssueParams {
    plIssueData: DPMS_PL_ISSUE_PK;
    changeIssueType: boolean;
    revise: boolean;
    typeCode: string;
    recreatedIssue: boolean;
}

export interface saveDocRevisionParams {
    typeCode: string;
    docRevData: any;
    issueRevID: number;
    revise: boolean;
    reviseID?: number;
    recreatedIssue: boolean;
}