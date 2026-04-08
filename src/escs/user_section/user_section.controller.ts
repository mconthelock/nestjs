import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { UsersSectionService } from './user_section.service';
import { SearchUsersSectionDto } from './dto/search-escs-usersection.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('ESCS Users Section')
@Controller('escs/userSection')
export class UsersSectionController {
  constructor(private readonly userSectionService: UsersSectionService) {}

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
  async getSection(@Body() searchDto: SearchUsersSectionDto) {
    return this.userSectionService.getSection(searchDto);
  }
}
