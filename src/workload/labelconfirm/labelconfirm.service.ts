import { Injectable } from '@nestjs/common';
import { CreateLabelconfirmDto } from './dto/create-labelconfirm.dto';
import { UpdateLabelconfirmDto } from './dto/update-labelconfirm.dto';
import { LabelconfirmRepository } from './labelconfirm.repository';

@Injectable()
export class LabelconfirmService {
    constructor(
        private readonly labelconfirmRepository: LabelconfirmRepository,
    ) {}

    async getLabelList(order: string, packing: string) {
        return this.labelconfirmRepository.getLabelList(order, packing);
    }

    async confirm(qrCode: string, empno: string) {
        return this.labelconfirmRepository.confirm(qrCode, empno);
    }
}
