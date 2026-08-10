import { Injectable } from '@nestjs/common';
import { now } from 'src/common/utils/dayjs.utils';
import { log_message, type IlogMessage } from 'src/common/utils/transform';
import { DpmsPlWeightChangeService } from 'src/workload/dpms_pl_weight_change/dpms_pl_weight_change.service';

@Injectable()
export class ReviseVgmService {
    constructor(
        private readonly changeWeightService: DpmsPlWeightChangeService,
    ) {}

    async reviseVgm(vanndate?: string) {
        const logMessage: IlogMessage[] = [log_message('Job started')];
        try {
            if (!vanndate) {
                vanndate = now();
            }
            logMessage.push(log_message(`Revising VGM for vanndate ${vanndate}`));
            // ดึงรายการเปลี่ยนแปลงน้ำหนักตามวัน vanning ที่กำหนด
            const changeLists =
                await this.changeWeightService.getChangeWeight(vanndate);
            if (!changeLists.status) {
                return {
                    status: false,
                    message: 'No change weight data found',
                };
            }

            for (const change of changeLists.data) {
                
            }

            return {
                status: true,
                message: `Retrieved ${changeLists.data.length} change weight records`,
                data: changeLists.data,
            };
        } catch (error) {
            throw new Error(`Error revising VGM: ${error.message}`);
        }
    }
}
