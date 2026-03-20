import { Injectable } from '@nestjs/common';
import { M001KPBM } from 'src/common/Entities/datacenter/table/M001KPBM.entity';
import { M12023_ITEMARRNGLST_APP } from 'src/common/Entities/elmes/table/M12023_ITEMARRNGLST_APP.entity';
import { M001KpbmService } from 'src/datacenter/m001-kpbm/m001-kpbm.service';
import { M12023ItemarrnglstAppService } from 'src/elmes/m12023_itemarrnglst_app/m12023_itemarrnglst_app.service';
import { OrderdummyService } from 'src/marketing/orderdummy/orderdummy.service';

interface GeneralPartList {
    ORDERNO: string;
    ITEMNO: string;
    PARTNAME: string;
    DRAWING: string;
    VARIABLE: string;
    APREMARK: string;
    SCNDPRTCLS: string;
    SUPPLYCLS: string;
    QTY: number;
}

@Injectable()
export class GeneralPartListService {
    constructor(
        private readonly datacenterService: M001KpbmService,
        private readonly elmesService: M12023ItemarrnglstAppService,
        private readonly orderdummyService: OrderdummyService,
    ) {}
    async getGPL(order: string, item: string) {
        let sys: string = '';
        let gpl: any = [];

        let orderMain = order;
        const checkOrderMain = await this.orderdummyService.getOrderMain(
            order,
            item,
        );
        if (checkOrderMain.status) {
            orderMain = checkOrderMain.data;
        }
        const getGPLDatacenter = await this.datacenterService.getGPL(
            orderMain,
            item,
        );
        const getGPLElmes = await this.elmesService.getGPL(orderMain, item);

        if (getGPLElmes.status) {
            sys = 'elmes';
            gpl = this.gpl_elmes(item, order, getGPLElmes.data);
        } else if (getGPLDatacenter.status) {
            sys = 'as400';
            gpl = this.gpl_as400(item, order, getGPLDatacenter.data);
        }
        const length = gpl.length;
        if (length === 0) {
            return {
                status: false,
                message: 'Get General part list data found 0 record(s)',
            };
        }
        return {
            status: true,
            message: `Get General part list data found ${length} record(s)`,
            sys: sys,
            data: gpl,
        };
    }

    gpl_elmes(
        item: string,
        order: string,
        gpl: M12023_ITEMARRNGLST_APP[],
    ): GeneralPartList[] | [] {
        let data: GeneralPartList[] = [];
        let i: number = -1;
        gpl.forEach((v) => {
            if (v.BMCLS == 'A') {
                if (v.PARTNO?.substring(1, 2) != ' ') {
                    i++;
                    data.push({
                        ORDERNO: order,
                        ITEMNO: item,
                        PARTNAME: v.APNAMERMRK?.trim() || '',
                        DRAWING: v.PARTNO?.trim() || '',
                        VARIABLE: '',
                        APREMARK: '',
                        SCNDPRTCLS: v.SCNDPRTCLS,
                        SUPPLYCLS: v.SUPPLYCLS?.trim() || '',
                        QTY: Number(v.TOTALQTY),
                    });
                } else if (data[i] != undefined) {
                    data[i].DRAWING += v.PARTNO?.trim() || '';
                }
            } else if (v.BMCLS == 'B' || v.BMCLS == 'C') {
                if (data[i] != undefined) {
                    const aprm: string = v.APNAMERMRK?.trim() || '';
                    const part: string = v.PARTNO?.trim() || '';
                    const temp: string =
                        aprm && part ? `${aprm}::${part}` : aprm + part;

                    if (temp != '' && v.BMCLS == 'B') {
                        data[i].VARIABLE +=
                            data[i].VARIABLE == '' ? temp : ', ' + temp;
                    } else if (temp != '' && v.BMCLS == 'C') {
                        data[i].APREMARK +=
                            data[i].APREMARK == '' ? temp : ', ' + temp;
                    }
                }
            }
        });
        return data;
    }

    gpl_as400(item: string, order: string, gpl: any[]): GeneralPartList[] {
        const data: GeneralPartList[] = [];

        gpl.forEach((row) => {
            const v = { ...row };
            // Set Drawing
            let dwg: string = v.D1;

            if (v.G1 !== '') {
                dwg += ' ' + v.G1;

                for (let n = 1; n <= 9; n++) {
                    if (!v[`L${n}`]) break;

                    dwg += n === 1 ? v[`L${n}`] : 'L' + v[`L${n}`];
                }
            }

            // Set Variable
            let varStr: string = '';

            for (let n = 1; n <= 30; n++) {
                if (!v[`P${n}`]) break;

                if (n !== 1) {
                    varStr += ', ';
                }

                varStr += `${v[`P${n}`]}=${v[`P${n + 1}`]}`;
                n++;
            }

            // Set QTY
            const qty: number = Number(v.QTY);

            // Push data
            data.push({
                ORDERNO: order,
                ITEMNO: item,
                PARTNAME: v.PART,
                DRAWING: dwg,
                VARIABLE: varStr,
                APREMARK: null,
                SCNDPRTCLS: v.SCND,
                SUPPLYCLS: null,
                QTY: qty,
            });
        });

        return data;
    }
}
