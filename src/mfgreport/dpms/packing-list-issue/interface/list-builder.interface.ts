export interface DetailForCreateHtml {
    VITEM?: string;
    VDRAWING?: string;
    VDRAWINGL?: string;
    VPART?: string;
    VISSUE_SELECTED?: 'Y' | 'N';
    NEW_LIST?: 'Y' | 'N';
    CHECKED?: 'Y' | 'N';
    VCASE?: string;
    CASE?: string;
    NQTY?: number | string;
    NET?: number | string;
    GROSS?: number | string;
    DIMENSION?: string;
    SEQ?: number;
    VOLUME?: number | string;
}

export interface ListForCreateHtml {
    VMFGNO: string;
    VCASE: string;
    VPACKSTYLE: string;
    NNETWEIGHT: string | number;
    NGROSSWEIGHT: string | number;
    VWIDTH: string;
    VLENGTH: string;
    VHEIGHT: string;
    DETAILS: DetailForCreateHtml[];
}

export interface CreateDataForHTMLResult {
    data: ListForCreateHtml[];
    totalNet: string;
    totalGross: string;
    totalDimention: string;
    totalPackages: number;
    totalPackList: { [key: string]: number };
}
