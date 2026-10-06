import { CreateDataForHTMLResult, ListForCreateHtml } from "./list-builder.interface";

import { DPMS_PL_ISSUE_REV } from "src/common/Entities/workload/table/DPMS_PL_ISSUE_REV.entity";
import { S020KP } from "src/common/Entities/datacenter/table/S020KP.entity";
import { S049KP } from "src/common/Entities/datacenter/table/S049KP.entity";
import { DPMS_PL_CASE_REVISE_VGM } from "src/common/Entities/workload/views/DPMS_PL_CASE_REVISE_VGM.entity";
import { DPMS_PL_CASE_LIST } from "src/common/Entities/workload/table/DPMS_PL_CASE_LIST.entity";

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
    lists: DPMS_PL_CASE_LIST[] | DPMS_PL_CASE_REVISE_VGM[];
    plList: CreateDataForHTMLResult;
    issueDate: string;
    combine?: S020KP[];
    changeBlock?: S049KP[];
}
