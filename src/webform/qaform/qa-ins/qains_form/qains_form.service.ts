import { Injectable } from '@nestjs/common';
import { FlowService } from 'src/webform/flow/flow.service';
import { SearchQainsFormDto } from './dto/search-qains_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UpdateQainsFormDto } from './dto/update-qains_form.dto';
import { QainsFormRepository } from './qains_form.repository';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';
import { QAINS_FORM } from 'src/common/Entities/webform/table/QAINS_FORM.entity';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class QainsFormService {
    constructor(
        protected readonly flowService: FlowService,
        protected readonly repo: QainsFormRepository,
        protected readonly mailService: MailService,
    ) {}

    async setFlow(condition: any, apv: string, rep: string) {
        const cond = {
            condition: condition,
            VAPVNO: apv,
            VREPNO: rep,
        };
        await this.flowService.updateFlow(cond);
    }

    async getFormData(dto: FormDto): Promise<QAINS_FORM> {
        return this.repo.getFormData(dto);
    }

    async search(dto: SearchQainsFormDto) {
        return this.repo.search(dto);
    }

    async update(dto: UpdateQainsFormDto) {
        try {
            const res = await this.repo.update(dto);

            if (res.affected === 0) {
                throw new Error('No rows updated');
            }
            return { status: true, result: res, message: 'success' };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async create(dto: UpdateQainsFormDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Create failed');
            }
            return { status: true, result: res, message: 'success' };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
