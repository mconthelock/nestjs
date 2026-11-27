import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmptaxService } from './emptax.service';

@Controller('as400/datalibi/emptax')
export class EmptaxController {
    constructor(private readonly emptaxService: EmptaxService) {}
}
