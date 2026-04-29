import { Injectable } from '@nestjs/common';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';
import { GpRbRepository } from './gp-rb.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';

@Injectable()
export class GpRbService {
    constructor(
        private readonly repo: GpRbRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
    ) {}

    findAll() {
        return this.repo.findAll();
    }

    async create(dto: CreateGpRbDto, ip: string) {
        try {
            const formmst =
                await this.formmstService.getFormMasterByVaname('GP-GAR');
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: dto.empCode,
                    INPUTBY: dto.empName,
                },
                ip,
            );
            console.log('Form Master;', formmst);
            return createForm;
        } catch (error) {
            throw new Error('Failed to ctrate GP-RB form');
        }
    }
}
