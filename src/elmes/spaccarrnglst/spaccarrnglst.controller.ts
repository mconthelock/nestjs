import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpaccarrnglstService } from './spaccarrnglst.service';
import { SearchSpaccarrnglstDto } from './dto/search-spaccarrnglst.dto';

@Controller('elmes/secondary')
export class SpaccarrnglstController {
  constructor(private readonly item: SpaccarrnglstService) {}

  @Post('search')
  create(@Body() q: SearchSpaccarrnglstDto) {
    return this.item.findAll(q);
  }
}
