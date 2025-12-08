import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpLocalPdmService } from './exp-local-pdm.service';
import { SearchExpLocalPdmDto } from './dto/search-exp-local-pdm.dto';

@Controller('exp-local-pdm')
export class ExpLocalPdmController {
  constructor(private readonly expLocalPdmService: ExpLocalPdmService) {}

  @Post('Y/melina') // 1.1
  async yMelina(@Body() dto: SearchExpLocalPdmDto) {
    return await this.expLocalPdmService.yMelina(dto);
  }

  @Post('Y/released') // 1.2
  async yReleased(@Body() dto: SearchExpLocalPdmDto) {
    return await this.expLocalPdmService.yReleased(dto);
  }

  @Post('Y/melina/notReleased') // 1.3
  async yMelinaNotReleased(@Body() dto: SearchExpLocalPdmDto) {
    return await this.expLocalPdmService.yMelinaNotReleased(dto);
  }

  @Post('Y/notReleased') // 1.4
  async yNotReleased() {
    return await this.expLocalPdmService.yNotReleased();
  }

  @Post('KB/new') // 2.1
  async kbNew(@Body() dto: SearchExpLocalPdmDto) {
    return await this.expLocalPdmService.kbNew(dto);
  }

  @Post('KB/revise') // 2.2
  async kbRevise(@Body() dto: SearchExpLocalPdmDto) {
    return await this.expLocalPdmService.kbRevise(dto);
  }
}
