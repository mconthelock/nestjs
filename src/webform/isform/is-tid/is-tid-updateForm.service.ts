import { Injectable } from '@nestjs/common';
import { IsTidService } from './is-tid.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { IsTidRepository } from './is-tid.repository';
import { ActionIsTidDto } from './dto/update-is-tid.dto';

@Injectable()
export class IsTidActionService extends IsTidService {
    constructor(
        protected readonly repo: IsTidRepository,
        private readonly doactionFlowService: DoactionFlowService,
    ) {
        super(repo);
    }

    async actionForm(dto: ActionIsTidDto, ip: string) {
        try {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            if (dto.data) {
                const update = await this.update(form, dto.data);
                if (!update.status) {
                    throw new Error(update.message);
                }
            }
            await this.doactionFlowService.doAction(
                {
                    ...form,
                    EMPNO: dto.EMPNO,
                    ACTION: dto.ACTION,
                    REMARK: dto.REMARK,
                },
                ip,
            );
            return {
                status: true,
                message: 'Action Form successfully',
            }
        } catch (error) {
            throw new Error('Action Form Failed: ' + error.message);
        }
    }
}
