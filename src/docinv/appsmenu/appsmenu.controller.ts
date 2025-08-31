import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { AppsmenuService } from './appsmenu.service';
import { CreateAppsmenuDto } from './dto/create-appsmenu.dto';

@Controller('docinv/menu')
export class AppsmenuController {
  constructor(private readonly menu: AppsmenuService) {}

  @Get('program/:id')
  findAll(@Param('id') id: number) {
    return this.menu.findAppMenu(id);
  }

  @Post()
  async create(@Body() body: CreateAppsmenuDto) {
    return this.menu.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: CreateAppsmenuDto) {
    return this.menu.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.menu.remove(+id);
  }
}
