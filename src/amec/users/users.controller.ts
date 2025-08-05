import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { searchDto } from './dto/search-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findEmp(@Param('id') id: string) {
    return this.usersService.findEmp(id);
  }

  @Get('image/:id')
  async findImage(@Param('id') id: string) {
    const response = await fetch(`http://webflow/images/emp/${id}.jpg`);
    if (response.status !== 200) {
      throw new NotFoundException('Data not found');
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return imageUrl;
  }

  @Post('search')
  async search(@Body() searchDto: searchDto) {
    const data = await this.usersService.search();
    const filtered = data.filter((val) => {
      return Object.entries(searchDto).every(([key, value]) => {
        return val[key] == value;
      });
    });

    return filtered;
  }
}
