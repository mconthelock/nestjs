import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { IimService } from './iim.service';

@Controller('as400/iim')
export class IimController {
    constructor(private readonly sevice: IimService) {}

    
}
