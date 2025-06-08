import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { AppsusersService } from './appsusers.service';

// import { CreateAppsuserDto } from './dto/create-appsuser.dto';
// import { UpdateAppsuserDto } from './dto/update-appsuser.dto';

@Controller('docinv/appsusers')
export class AppsusersController {
  constructor(private readonly users: AppsusersService) {}

  //User For Login page
  //   @Get(':id/:pgm')
  //   async findOne(@Param('id') id: string, @Param('pgm') pgm: number) {
  //     const app = await this.apps.findOne(pgm);
  //     console.log(app);

  //     if (!app) return null;

  //   }

  //   @Post()
  //   create(@Body() createAppsuserDto: CreateAppsuserDto) {
  //     return this.appsusersService.create(createAppsuserDto);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateAppsuserDto: UpdateAppsuserDto) {
  //     return this.appsusersService.update(+id, updateAppsuserDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.appsusersService.remove(+id);
  //   }
}
