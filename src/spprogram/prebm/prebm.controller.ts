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
      await this.delete(data);

      console.log(data.header, data.detail, data.variable);

      header.filters = data.header;
      await this.prebm.create(header, 'RTNLIBF.Q601KP1');

      data.detail.forEach(async (item: any) => {
        detail.filters = item;
        await this.prebm.create(detail, 'RTNLIBF.Q601KP2');
      });

      data.variable.forEach(async (vl: any) => {
        variable.filters = vl;
        await this.prebm.create(variable, 'RTNLIBF.Q601KP4');
      });
      return { message: 'Data created successfully' };
    } catch (error) {
      await this.delete(data);
      console.error('Error executing query:', error);
      throw new Error(error);
    }
  }

  @Post('delete')
  async delete(@Body() data: any) {
    try {
      const header = new FiltersDto();
      const detail = new FiltersDto();
      const variable = new FiltersDto();
      header.filters = [{ field: 'Q6K101', op: 'eq', value: data.inquiryNo }];
      await this.prebm.delete(header, 'RTNLIBF.Q601KP1');

      detail.filters = [{ field: 'Q6K201', op: 'eq', value: data.inquiryNo }];
      await this.prebm.delete(detail, 'RTNLIBF.Q601KP2');

      variable.filters = [{ field: 'Q6K401', op: 'eq', value: data.inquiryNo }];
      await this.prebm.delete(variable, 'RTNLIBF.Q601KP4');
      this.delete(data);
      return { message: 'Data deleted successfully' };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}
