export interface DPMS_PL_MELT_REPORT {
    LOADNO: number;
    VANNDATE: string;
    AMECLOAD: string;
    CONTAINSIZE: string;
    PROJECT: string;
    ACTUAL_WEIGHT: number;
    CASEISSUE: number;
    CASETOTAL: number;
    WAIT_FOR_MELT: string;
    TOTALSENT: number;
}

export interface ListReport {
    status: boolean;
    message: string;
    data?: DPMS_PL_MELT_REPORT[];
}