import { Injectable } from '@nestjs/common';
import { DpmsPackingListMainRepository } from './dpms_packing_list_main.repository';
import { S001kpService } from 'src/as400/rtnlibf/s001kp/s001kp.service';

@Injectable()
export class DpmsPackingListMainService {
    constructor(
        private readonly repo: DpmsPackingListMainRepository,
        private readonly as400S001kpService: S001kpService,
    ) {}

    async findPackingListByMfgNo(mfgNo: string) {
        try {
            const res = await this.repo.findPackingListByMfgNo(mfgNo);
            if (res.length === 0) {
                return {
                    status: false,
                    message: `No packing list found for MFG No: ${mfgNo}`,
                };
            }
            const drawingL = await this.as400S001kpService.packinglist(mfgNo);
            const drawingMap = new Map();

            drawingL.forEach((d: any) => {
                drawingMap.set(
                    `${d.VMFGNO}_${d.VDRAWING}`,
                    d.VDRAWINGL
                );
            });

            res.forEach((item) => {
                item.DETAILS.forEach((detail: any) => {

                    const key = `${item.VMFGNO}_${detail.VDRAWING}`;

                    const drawingLValue = drawingMap.get(key);

                    if (drawingLValue) {
                        detail.VDRAWINGL = drawingLValue;
                    }
                });
            });
            return {
                status: true,
                message: `${res.length} packing list(s) found for MFG No: ${mfgNo}`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to find packing list for MFG No: ${mfgNo}. Error: ${error.message}`,
            );
        }
    }
}
