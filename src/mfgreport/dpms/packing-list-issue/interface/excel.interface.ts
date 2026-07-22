import { ListPLDto } from "../dto/create-packing-list-issue.dto";

export interface GenerateExcelParam {
    list: ListPLDto[];
    shippingMark: string;
    path: string;
    fileName: string;
    order: string;
    subject: string;
    project: string;
}
