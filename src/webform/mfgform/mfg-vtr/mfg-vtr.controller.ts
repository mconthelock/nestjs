import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { MfgVtrService } from './mfg-vtr.service';
import { CreateMfgVtrDto } from './dto/create-mfg-vtr.dto';
import { UpdateMfgVtrDto } from './dto/update-mfg-vtr.dto';

@Controller('mfg-vtr')
export class MfgVtrController {
    constructor(private readonly mfgVtrService: MfgVtrService) {}
}
