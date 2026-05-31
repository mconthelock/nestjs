import { Injectable } from '@nestjs/common';
import { FlowService } from './flow.service';
import { DeleteFlowStepDto } from './dto/update-flow.dto';

@Injectable()
export class DeleteFlowStepService extends FlowService {
    async deleteFlowStep(
        dto: DeleteFlowStepDto,
    ): Promise<{ status: boolean; message: string }> {
        try {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };

            var flowStart = false;

            const flow = await this.getFlow({ ...form, CSTEPNO: dto.CSTEPNO });
            if (flow.length === 0) {
                // throw new Error('Flow step not found');
                return {
                    status: false,
                    message: 'Flow step not found',
                };
            }

            for (const step of flow) {
                if (step.CSTART == '1') {
                    flowStart = true;
                }
                // Update previous step
                await this.updateFlow({
                    condition: { ...form, CSTEPNEXTNO: step.CSTEPNO },
                    CSTEPNEXTNO: step.CSTEPNEXTNO,
                });
                // Update start step
                if (flowStart) {
                    await this.updateFlow({
                        condition: { ...form, CSTEPNO: step.CSTEPNEXTNO },
                        CSTART: '1',
                    });
                }
                // Update next step
                const stepReady = await this.getFlow({
                    ...form,
                    CSTEPST: this.STEP_READY,
                });
                await this.updateFlow({
                    condition: { ...form, CSTEPNO: stepReady[0].CSTEPNEXTNO },
                    CSTEPST: '2',
                });
                const condition = {
                    ...form,
                    CSTEPNO: step.CSTEPNO,
                };
                await this.deleteFlow(condition);
            }
            return {
                status: true,
                message: 'Delete Flow Step Successfully',
            };
        } catch (error) {
            throw new Error('Delete Flow Step Error: ' + error.message);
        }
    }
}
