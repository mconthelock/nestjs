import type { DPMS_PL_ISSUE_REV } from "src/common/Entities/workload/table/DPMS_PL_ISSUE_REV.entity";
import { CreateDataForHTMLResult, ListForCreateHtml } from "./list-builder.interface";

export interface IplHeader {
    VSHOPORDERNO: string;
    VSUBJECT: string;
    VNAMEOFBLDG: string;
    VSOLDTO: string;
}

export interface IsetHeaderParams extends IplHeader {
    type: string;
    shippingMark: string;
    packingDate: string;
    round?: string;
    totalNet?: string;
    totalGross?: string;
    totalDimention?: string;
    totalPackages?: string;
}

export interface IsetTableParams {
    list: ListForCreateHtml[];
    checkbox?: boolean;
    totalPackList: Record<string, number>;
    totalNet: string;
    totalGross: string;
    totalDimention: string;
    typeCode: string;
    revise?: boolean;
    docType?: string[];
}

export interface IgenerateParams {
    revData: DPMS_PL_ISSUE_REV;
    shippingMark: string;
    plList: CreateDataForHTMLResult;
    issueDate: string;
    remank?: string;
}
