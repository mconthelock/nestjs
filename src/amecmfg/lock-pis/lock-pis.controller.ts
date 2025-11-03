import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UpdateLockPiDto } from './dto/update-lock-pi.dto';
import { CreateLockPiDto } from './dto/create-lock-pi.dto';
import { LockPisService } from './lock-pis.service';

@Controller('lockpis')
export class LockPisController {
  constructor(private readonly LockPisService: LockPisService) {}

  @Get('findAll')
  async findAll() {
    return await this.LockPisService.findAll();
  }

  @Get('findOne')
  async findOne(@Param('item') item: string, @Param('order') order: string) {
    return await this.LockPisService.findOne(item, order);
  }

  @Post('search')
  async search(@Body() dto: UpdateLockPiDto) {
    return await this.LockPisService.search(dto);
  }

  @Delete('clearAll')
  async clearAll() {
    return await this.LockPisService.deleteAll();
  }

  @Delete('delete')
  async delete(@Body() dto: UpdateLockPiDto) {
    return await this.LockPisService.delete(dto);
  }
}
