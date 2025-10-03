import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSUserFileService } from './user-file.service';
import { ESCSCreateUserFileDto } from './dto/create-user-file.dto';
import { ESCSUpdateUserFileDto } from './dto/update-user-file.dto';

@Controller('user-file')
export class ESCSUserFileController {
  constructor(private readonly userFileService: ESCSUserFileService) {}

  @Post()
  create(@Body() createUserFileDto: ESCSCreateUserFileDto) {
    return this.userFileService.create(createUserFileDto);
  }

  @Get()
  findAll() {
    return this.userFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserFileDto: ESCSUpdateUserFileDto) {
    return this.userFileService.update(+id, updateUserFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFileService.remove(+id);
  }
}
