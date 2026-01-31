import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EbgreqformService } from './ebgreqform.service';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('ebudget/form')
export class EbgreqformController {
  constructor(private readonly ebgreqformService: EbgreqformService) {}

  @Post('Data')
  findOne(@Body() form: FormDto) {
    return this.ebgreqformService.findOne(form);
  }
}
