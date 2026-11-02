import { FormDto } from 'src/webform/form/dto/form.dto';
import { CreatePurPraFormDto } from '../dto/create-pur-pra-form.dto';

export interface ImanageFlow {
    form: FormDto;
    priceComparisonNo: string;
    dto: CreatePurPraFormDto;
}

export interface IsetFlow {
    hasDim: boolean;
    insertFlow: boolean;
    form: FormDto;
}

export interface IinsertFile {
    form: FormDto;
    createBy: string;
    files: Express.Multer.File[];
    deleteLists?: number[];
    mode: number;
}
