import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findEmp(@Param('id') id: string) {
    return this.usersService.findEmp(id);
  }

  @Get('/image/:id')
  async findImage(@Param('id') id: string) {
    const response = await fetch(`http://webflow/images/emp/${id}.jpg`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return imageUrl;
  }
}
