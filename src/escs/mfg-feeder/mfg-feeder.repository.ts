import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { F001KP } from 'src/common/Entities/escs/table/F001KP.entity';
import { Q90010P2 } from 'src/common/Entities/escs/table/Q90010P2.entity';

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
}