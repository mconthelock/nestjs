import { Injectable } from '@nestjs/common';
import {
  parseConditionString,
  parseCreateString,
} from 'src/common/helpers/query.helper';
import { ConectionService } from 'src/as400/conection/conection.service';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class PrebmService {
  constructor(private conn: ConectionService) {}

  async create(data: FiltersDto, table: string) {
    const query = await parseCreateString(data, table);
    console.log(query);
    const result = await this.conn.runQuery(query);
    return result;
  }

  async update(data: FiltersDto, table: string) {
    const query = await parseCreateString(data, table);
    console.log(query);
  }

  async delete(data: FiltersDto, table: string) {
    const query = await parseConditionString(data);
    const result = await this.conn.runQuery(`DELETE FROM ${table} ${query}`);
    return result;
  }

  async findAll(q: FiltersDto) {
    const conditionString = await parseConditionString(q);
    const result = await this.conn.runQuery(
      `SELECT * FROM RTNLIBF.Q601KP1
        ${conditionString}`,
    );
    return result;
  }
}
