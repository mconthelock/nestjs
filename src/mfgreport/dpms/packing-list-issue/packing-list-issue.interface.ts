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
}
