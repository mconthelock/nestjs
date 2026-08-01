import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { UniformService } from './uniform.service';
import { CreateUniformDto } from './dto/create-uniform.dto';
import { UpdateUniformDto } from './dto/update-uniform.dto';

@Controller('gpreport/uniform')
export class UniformController {
    constructor(private readonly uniformService: UniformService) {}

    @Get('master')
    findAll() {
        return this.uniformService.findAll();
    }
}
