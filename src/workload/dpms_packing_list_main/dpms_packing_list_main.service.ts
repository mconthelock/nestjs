import { Injectable } from '@nestjs/common';
import { DpmsPackingListMainRepository } from './dpms_packing_list_main.repository';
// import { S001kpService } from 'src/as400/rtnlibf/s001kp/s001kp.service';
import { S011mpService } from 'src/datacenter/s011mp/s011mp.service';

@Injectable()
export class DpmsPackingListMainService {
    constructor(
        private readonly repo: DpmsPackingListMainRepository,
        // private readonly as400S001kpService: S001kpService,
        private readonly s011mpService: S011mpService,
    ) {}

    async findPackingListByMfgNo(mfgNo: string, po: boolean = false) {
        try {
            let res = [];
            let hasDetails: boolean = false;
            if (po) {
                res = await this.repo.findPackingListPoByMfgNo(mfgNo);
            } else {
                res = await this.repo.findPackingListByMfgNo(mfgNo);
            }
            if (res.length === 0) {
                return {
                    status: false,
                    message: `No packing list found for MFG No: ${mfgNo}`,
                };
            }
            const packingDiff = await this.s011mpService.findPacking(mfgNo);
            // const packingDiff = await this.s011mpService.findPackingDiff(mfgNo);
            // const drawingL = await this.as400S001kpService.packinglist(mfgNo);
            // const drawingMap = new Map();

            // drawingL.forEach((d: any) => {
            //     drawingMap.set(`${d.VMFGNO}_${d.VDRAWING}`, d.VDRAWINGL);
            // });
            // res.map((item) => {
            //     const details = po ? item.DETAILS_PO : item.DETAILS;
            //     hasDetails = details && details.length > 0;
            //     item.DETAILS = details.map((detail: any) => {
            //         const key = `${item.VMFGNO}_${detail.VDRAWING}`;
            //         const drawingLValue = drawingMap.get(key);
            //         if (drawingLValue) {
            //             detail.VDRAWINGL = drawingLValue;
            //         }
            //         return detail;
            //     });
            // });
            if (packingDiff.status) {
                res = res.map((item) => {
                    const details = po ? item.DETAILS_PO : item.DETAILS;
                    hasDetails = details && details.length > 0;
                    item.DETAILS = details.flatMap((detail: any) => {
                        const match = packingDiff.data.filter((d: any) => {
                            return (
                                d.S11M01 === detail.VMFGNO &&
                                d.S11M02 === detail.VITEM &&
                                d.S11M06 === detail.VDRAWING &&
                                d.MAXQTY === detail.NQTY
                            );
                        });
                        if (match.length > 0) {
                            return match.map((m: any) => ({
                                ...detail,
                                VDRAWINGL: m.LEVEL,
                                NQTY: m.S11M09,
                            }));
                        }
                        return detail;
                    });
                    return item;
                });
            }

            if (!hasDetails) {
                return {
                    status: false,
                    message: `No details found for packing list with MFG No: ${mfgNo}`,
                };
            }
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
