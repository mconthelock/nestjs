import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSUserItemService } from './user-item.service';
import { ESCSCreateUserItemDto } from './dto/create-user-item.dto';
import { ESCSUpdateUserItemDto } from './dto/update-user-item.dto';

@Controller('user-item')
export class ESCSUserItemController {
  constructor(private readonly userItemService: ESCSUserItemService) {}

  @Post()
  create(@Body() createUserItemDto: ESCSCreateUserItemDto) {
    return this.userItemService.create(createUserItemDto);
  }

  @Get()
  findAll() {
    return this.userItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserItemDto: ESCSUpdateUserItemDto) {
    return this.userItemService.update(+id, updateUserItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userItemService.remove(+id);
  }
}
