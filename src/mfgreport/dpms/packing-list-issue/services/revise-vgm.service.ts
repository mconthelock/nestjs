import { Injectable } from '@nestjs/common';
import { DpmsPlWeightChangeService } from 'src/workload/dpms_pl_weight_change/dpms_pl_weight_change.service';

@Injectable()
export class ReviseVgmService {
    constructor(private readonly changeWeightService: DpmsPlWeightChangeService) {}

    async reviseVgm(vanndate?: string) {
        try{
            const changeLists = await this.changeWeightService.getChangeWeight();
            if (!changeLists.status) {
                return {
                    status: false,
                    message: 'No change weight data found',
                };
            }
        } catch (error) {
            throw new Error(`Error revising VGM: ${error.message}`);
        }
    }
}
