import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetDrawingBmDto } from './dto/get-drawing-bm.dto';
import { F001KP } from 'src/common/Entities/escs/table/F001KP.entity';
import { Q90010P2 } from 'src/common/Entities/escs/table/Q90010P2.entity';
import { M008KP } from 'src/common/Entities/escs/table/M008KP.entity';
import { AMECORDERS_PROCESS } from 'src/common/Entities/escs/table/AMECORDERS_PROCESS.entity';

@Injectable()
export class MfgFeederRepository {
    constructor(
        @InjectDataSource('escsConnection')
        private readonly ds: DataSource,
    ) {}

    async getInfo(controlNo: string) {
        return this.ds
            .createQueryBuilder()
            .select(
                `TO_CHAR(SYSDATE, 'DD-Mon-RR')`,
                'INSDATE',
            )
            .addSelect(
                `CONVERT_PROD(F.F01R02)`,
                'PROD',
            )
            .addSelect(
                `Q.Q9TYP`,
                'MODEL',
            )
            .from(
                F001KP,
                'F',
            )
            .innerJoin(
                Q90010P2,
                'Q',
                'F.F01R07 = Q.Q9ORD',
            )
            .where(
                'F.F01R01 = :controlNo',
                { controlNo },
            )
            .getRawOne();
    }

    async getDrawingBMCount(dto: GetDrawingBmDto) {
        return this.ds
            .createQueryBuilder()
            .select(
                `SUM(CASE WHEN SUBSTR(K.M8K01, -1) = '1' THEN 1 ELSE 0 END)`,
                'PROD_1',
            )
            .addSelect(
                `SUM(CASE WHEN SUBSTR(K.M8K01, -1) = '2' THEN 1 ELSE 0 END)`,
                'PROD_2',
            )
            .addSelect(
                `SUM(CASE WHEN SUBSTR(K.M8K01, -1) = '3' THEN 1 ELSE 0 END)`,
                'PROD_3',
            )
            .addSelect(
                `SUM(CASE WHEN SUBSTR(K.M8K01, -1) = '4' THEN 1 ELSE 0 END)`,
                'PROD_4',
            )
            .addSelect(
                `SUM(CASE WHEN SUBSTR(K.M8K01, -1) = '5' THEN 1 ELSE 0 END)`,
                'PROD_5',
            )
            .addSelect(
                `SUM(CASE WHEN SUBSTR(K.M8K01, -1) = '6' THEN 1 ELSE 0 END)`,
                'PROD_6',
            )
            .from(
                M008KP,
                'K',
            )
            .innerJoin(
                AMECORDERS_PROCESS,
                'P',
                'P.MFGNO = K.M8K03',
            )
            .where(
                'P.PROCNO LIKE :process',
                {
                    process: `__${dto.process}`,
                },
            )
            .andWhere(
                'P.DWG LIKE :drawing',
                {
                    drawing: `${dto.drawing}%`,
                },
            )
            .andWhere(
                'K.M8K01 LIKE :prod',
                {
                    prod: `${dto.prod}_`,
                },
            )
            .getRawOne();
    }
}