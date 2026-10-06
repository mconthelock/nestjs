import { Injectable } from '@nestjs/common';
import {
    parseConditionString,
    parseCreateString,
} from 'src/common/helpers/query.helper';
import { ConectionService } from 'src/as400/conection/conection.service';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class T002kpService {
    async update(data: FiltersDto, table: string) {
        const query = await parseCreateString(data, table);
        console.log(query);
    }
}
