import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { StInpService } from './st-inp.service';
import { CreateStInpDto } from './dto/create-st-inp.dto';
import { UpdateStInpDto } from './dto/update-st-inp.dto';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';

@Controller('stform/st-inp')
export class StInpController {
    constructor(private readonly stInpService: StInpService) {}

    @Post()
    Create(@Body() createStInpDto: CreateStInpDto, @Req() req: Request) {
         const ip = getClientIP(req);
        return this.stInpService.create(createStInpDto, ip);
    }
}
