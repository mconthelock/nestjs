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
import { SearchEscsUserSectionDto } from './dto/search-escs-usersection.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('ESCS User Section')
@Controller('escs/userSection')
export class UserSectionController {
  constructor(private readonly userSectionService: UserSectionService) {}

  @Get()
  @ApiOperation({
    summary: 'getUserSecAll',
  })
  getUserSecAll() {
    return this.userSectionService.getUserSecAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'getUserSecByID',
  })
  @ApiParam({ name: 'id', example: 1, required: true })
  getUserSecByID(@Param('id') id: number) {
    return this.userSectionService.getUserSecByID(id);
  }

  @Post('getSection')
  @ApiOperation({
    summary: 'getSection',
  })
  async getSection(@Body() searchDto: SearchEscsUserSectionDto) {
    return this.userSectionService.getSection(searchDto);
  }
}
