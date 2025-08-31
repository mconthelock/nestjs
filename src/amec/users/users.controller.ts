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
import * as fs from 'fs';
import * as path from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findEmp(@Param('id') id: string) {
    return this.usersService.findEmp(id);
  }

  @Get('image/:id')
  async findImage(@Param('id') id: string) {
    try {
      const response = await fetch(`http://webflow/images/emp/${id}.jpg`);
      if (response.status !== 200) {
        throw new NotFoundException('Data not found');
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const imageUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      return imageUrl;
    } catch (error) {
      const filePath = path.join(process.cwd(), 'public', 'Untitled.png');
      const fileBuffer = fs.readFileSync(filePath);
      const base64 = fileBuffer.toString('base64');
      return `data:image/png;base64,${base64}`;
    }
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
