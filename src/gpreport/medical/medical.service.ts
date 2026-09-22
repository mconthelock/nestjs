import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMedicalDto } from './dto/create-medical.dto';
import { UpdateMedicalDto } from './dto/update-medical.dto';

import { OPDRIGHT } from 'src/common/Entities/webform/table/OPDRIGHT.entity';
import { WelfareDetailView } from 'src/common/Entities/webform/views/VIEW_WELFARE_DETAIL.entity';

@Injectable()
export class MedicalService {
    constructor(
        @InjectRepository(OPDRIGHT, 'webformConnection')
        private readonly opdrightRepository: Repository<OPDRIGHT>,

        @InjectRepository(WelfareDetailView, 'webformConnection')
        private readonly form: Repository<WelfareDetailView>,
    ) {}

    findRight(sempno: string, opdyear: string): Promise<OPDRIGHT | null> {
        return this.opdrightRepository.findOne({
            where: {
                SEMPNO: sempno,
                OPDYEAR: opdyear,
            },
        });
    }

    findForms(sempno: string, opdyear: string) {
        return this.form.find({
            where: {
                SEMPNO_IN: sempno,
                OPDYEAR: opdyear,
            },
        });
    }
}
