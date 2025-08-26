import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ESCSUserService } from './user.service';
import { SearchEscsUserDto } from './dto/search-escs-user.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('ESCS User')
@Controller('escs/user')
export class ESCSUserController {
  constructor(private readonly userService: ESCSUserService) {}
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getUserAll() {
    return this.userService.getUserAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', example: 1, required: true })
  getUserByID(@Param('id') id: number) {
    return this.userService.getUserByID(id);
  }

  @Post('getUser')
  @ApiOperation({ summary: 'Search users' })
  async getUser(@Body() searchDto: SearchEscsUserDto) {
    return this.userService.getUser(searchDto);
  }
}
