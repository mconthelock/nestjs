import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserSectionService } from './user_section.service';
import { SearchDto } from './dto/search.dto';

@Controller('escs/userSection')
export class UserSectionController {
  constructor(private readonly userSectionService: UserSectionService) {}

  @Get()
  getUserSecAll() {
    return this.userSectionService.getUserSecAll();
  }

  @Get(':id')
  getUserSecByID(@Param('id') id: number) {
    return this.userSectionService.getUserSecByID(id);
  }

  @Post('getSection')
  async getSection(@Body() searchDto: SearchDto) {
    return this.userSectionService.getSection(searchDto);
  }
}
