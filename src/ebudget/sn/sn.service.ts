import { Injectable } from '@nestjs/common';
import { SearchEbudgetSnDto } from './dto/search-sn.dto';
import { SnRepository } from './sn.repository';
import { EBUDGET_DATA_SN } from 'src/common/Entities/ebudget/views/EBUDGET_DATA_SN.entity';
import { EbgreqformService } from '../ebgreqform/ebgreqform.service';

@Injectable()
export class SnService {
    constructor(
        private readonly repo: SnRepository,
        private readonly ebgreqFormService: EbgreqformService,
    ) {}

    findAll() {
        return this.repo.findAll();
    }

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-24
     * @description ดึงข้อมูล sn โดยไม่นับ allocate รวม form ตนเองหากมีส่งมา
     * @param dto 
     * @returns 
     */
    async getDataSn(dto: SearchEbudgetSnDto) {
        try {
            const result: EBUDGET_DATA_SN[] = await this.repo.getDataSn(dto);
            if (dto.FORM) {
                const form = await this.ebgreqFormService.findOne(dto.FORM);
                return result.map((item) => {
                    if (item.FYEAR === form.FYEAR && item.SN === form.SCATALOG && form.REQAMT) {
                        item.ALLOCATE = item.ALLOCATE - form.REQAMT;
                    }
                    return item;
                });
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}
