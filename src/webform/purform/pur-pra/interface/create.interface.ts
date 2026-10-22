import type { FormDto } from 'src/webform/form/dto/form.dto';

export interface ImanageFlow {
    form: FormDto;
    priceComparisonNo: string;
}

export interface IinsertFile {
    form: FormDto;
    createBy: string;
    files: Express.Multer.File[];
    deleteLists?: number[];
    mode: number;
}
