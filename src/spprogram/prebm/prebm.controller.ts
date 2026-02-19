import { Controller, Post, Body } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { PrebmService } from './prebm.service';

@Controller('sp/prebm')
export class PrebmController {
  constructor(private readonly prebm: PrebmService) {}

  @Post('search')
  async findAll(@Body() q: FiltersDto) {
    const result = await this.prebm.findAll(q);
    return result;
  }

  @Post('create')
  async create(@Body() data: any) {
    const header = new FiltersDto();
    const detail = new FiltersDto();
    const variable = new FiltersDto();
    try {
      header.filters = data.header;
      await this.prebm.create(header, 'RTNLIBF.Q601KP1');
      detail.filters = data.detail;
      await this.prebm.create(detail, 'RTNLIBF.Q601KP2');

      //   variable.filters = data.variable;
      //   await this.prebm.create(variable, 'RTNLIBF.Q601KP4');
    } catch (error) {
      header.filters = [{ field: 'Q6K101', op: 'eq', value: data.inquiryNo }];
      await this.prebm.delete(header, 'RTNLIBF.Q601KP1');
      console.error('Error executing query:', error);
      throw error;
    }
  }

  @Post('update')
  async updateVariable(@Body() data: any) {
    const filtersData = new FiltersDto();
    filtersData.filters = data.header;
    await this.prebm.update(filtersData, 'RTNLIBF.Q601KP1');
    //await this.prebm.update(data.detail, 'RTNLIBF.Q601KP2');
  }
}
