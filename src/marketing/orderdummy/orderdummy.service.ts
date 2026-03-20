import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { SearchOrderdummyDto } from './dto/search-orderdummy.dto';
import { TMARKET_TEMP_DUMMY } from 'src/common/Entities/datacenter/table/TMARKET_TEMP_DUMMY.entity';
import { OrderdummyRepository } from './orderdummy.repository';

@Injectable()
export class OrderdummyService {
    constructor(
        @InjectRepository(TMARKET_TEMP_DUMMY, 'datacenterConnection')
        private readonly ords: Repository<TMARKET_TEMP_DUMMY>,
        private readonly repo: OrderdummyRepository,
    ) {}

    async search(req: SearchOrderdummyDto) {
        const where = {};
        if (req.SERIES) where['SERIES'] = req.SERIES;
        if (req.AGENT) where['AGENT'] = req.AGENT;
        if (req.PRJ_NO) where['PRJ_NO'] = req.PRJ_NO;
        if (req.ORDER_NO) where['ORDER_NO'] = req.ORDER_NO;
        if (req.MFGNO) where['MFGNO'] = req.MFGNO;
        if (req.CAR_NO) {
            const trimmedCarNo = req.CAR_NO.trim(); // Trim ค่าจาก input ด้วย
            where['CAR_NO'] = Raw(
                (columnAlias) => `TRIM(${columnAlias}) = :trimmedCarNo`,
                { trimmedCarNo },
            );
        }

        if (req.SMFGNO) {
            const trimmedMfgNo = req.SMFGNO.trim();
            where['MFGNO'] = Raw(
                (columnAlias) => `MFGNO LIKE '%${trimmedMfgNo}%'`,
                {
                    trimmedMfgNo,
                },
            );
        }
        return await this.ords.find({ where: where });
    }

    async getOrderMain(order: string, item: string) {
        try {
            const res = await this.repo.getOrderMain(order, item);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: `Failed: No data found`,
                };
            }
            const ordermain = res[0].MFGMAIN;
            return {
                status: true,
                message: `Success: Data found with ordermain ${ordermain}`,
                data: ordermain,
            };
        } catch (error) {
            throw new Error(
                `Get GPL by ${order}, ${item} Error: ` + error.message,
            );
        }
    }
}
