import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CancelTagDto } from './dto/cancel-tag.dto';
import { IdtagRepository } from './idtag.repository';

@Injectable()
export class IdtagService {
    constructor(
        private readonly repo: IdtagRepository,
    ) {}

    async updateTag(dto: UpdateTagDto) {
        try {
            const [{ HHMMSS, YYMMDD, HHMM, FINDATE }] = await this.repo.getCurrentDateTime();
            const findate = dto.findate || FINDATE;
            const [dd, mm, yyyy] = findate.split('/');
            const period = this.getPeriod(HHMM);
            const finish = Number(`${yyyy}${mm}${dd}`);
            const remark = `${HHMMSS}/${YYMMDD}/${dto.empno}`;

            await this.repo.createLog({
                CONTROL: dto.controlno,
                PROCESS: dto.process,
                PERIOD: period,
                FINISH_DATE: finish,
                REMARK: remark,
                EMPNO: dto.empno,
            });

            await this.repo.updateTag(
                dto.controlno,
                dto.process,
                period,
                finish,
                remark,
            );

            await this.repo.updateLog(
                dto.controlno,
                dto.process,
            );

            return {
                success: true,
                message: 'Update ID Tag Success',
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async cancelTag(dto: CancelTagDto) {
        try {
            await this.repo.cancelTag(
                dto.controlno,
                dto.process,
            );

            await this.repo.updateLog(
                dto.controlno,
                dto.process,
            );

            return {
                success: true,
                message: 'Cancel ID Tag Success',
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    private getPeriod(time: string) {
        if (time >= '0800' && time <= '1730') return '1';
        if (time >= '1800' && time <= '2000') return '2';
        if (time >= '2000' || time <= '0530') return '3';
        if (time >= '0600' && time <= '0800') return '4';
        return '';
    }
}