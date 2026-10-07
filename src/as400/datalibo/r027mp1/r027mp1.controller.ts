import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';

import { R027Mp1Service } from './r027mp1.service';

@Controller('r027mp1')
export class R027Mp1Controller {
    constructor(private readonly r027Mp1Service: R027Mp1Service) {}
}
