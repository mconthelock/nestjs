import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SearchDto } from './dto/search.dto';

@Controller('escs/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getUserAll() {
    return this.userService.getUserAll();
  }

  @Get(':id')
  getUserByID(@Param('id') id: number) {
    return this.userService.getUserByID(id);
  }

  @Post('getUser')
  async getUser(@Body() searchDto: SearchDto) {
    return this.userService.getUser(searchDto);
  }

}
