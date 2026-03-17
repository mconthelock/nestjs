import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';
import { parseConditionString } from 'src/common/helpers/query.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class R027mp1Service {
    constructor(private conn: ConectionService) {}

    async findAll(q: FiltersDto) {
        const conditionString = await parseConditionString(q);
        const result = await this.conn.runQuery(
            `SELECT * FROM RTNLIBF.R027MP1
        ${conditionString}`,
        );
        return result;
    }
}
