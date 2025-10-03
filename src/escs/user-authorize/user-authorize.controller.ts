import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSUserAuthorizeService } from './user-authorize.service';
import { ESCSCreateUserAuthorizeDto } from './dto/create-user-authorize.dto';
import { ESCSUpdateUserAuthorizeDto } from './dto/update-user-authorize.dto';

@Controller('user-authorize')
export class ESCSUserAuthorizeController {
  constructor(private readonly userAuthorizeService: ESCSUserAuthorizeService) {}

  @Post()
  create(@Body() createUserAuthorizeDto: ESCSCreateUserAuthorizeDto) {
    return this.userAuthorizeService.create(createUserAuthorizeDto);
  }

  @Get()
  findAll() {
    return this.userAuthorizeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAuthorizeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserAuthorizeDto: ESCSUpdateUserAuthorizeDto) {
    return this.userAuthorizeService.update(+id, updateUserAuthorizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAuthorizeService.remove(+id);
  }
}
