import { Controller, Get , Query} from '@nestjs/common';
import { PpositionService } from './pposition.service';

@Controller('amec/pposition')
export class PpositionController {
  constructor(private readonly spos: PpositionService) {}

  @Get('all')
  findAll() {
    return this.spos.findAll();
  }

  @Get('filter')
  async getFilteredPositions(@Query('codes') codesString?: string) {
    let targetCodes = ['10', '11', '20', '21', '30']; // ค่าเริ่มต้นตามโจทย์
    if (codesString) {
      // แปลงจากคอมมา "10,11,20" => ['10', '11', '20']
      targetCodes = codesString.split(',').map(code => code.trim());
    }
    return await this.spos.findSpecificPositions(targetCodes);
  }
}
