import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { GpTphService } from './gp-tph.service';
import { CreateGpTphDto } from './dto/create-gp-tph.dto';
import { UpdateGpTphDto } from './dto/update-gp-tph.dto';

@Controller('gpform/gp-tph')
export class GpTphController {
    constructor(private readonly gpTphService: GpTphService) {}

    @Get('areas')
    findAllAreas() {
      return this.gpTphService.findAllAreas();
    }

    @Get('location')
    findAllLocations() {
      return this.gpTphService.findAllLocations();
    }
}
